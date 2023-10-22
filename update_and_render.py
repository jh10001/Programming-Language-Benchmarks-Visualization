import os
import re
import sys
import time
import json
import math
import datetime
import base64
import pandas as pd
import requests
from PIL import Image
from PIL.PngImagePlugin import PngImageFile
from bs4 import BeautifulSoup
from pipeit import *
from typing import List, Set, Dict
from io import BytesIO
from selenium import webdriver

# pd.set_option('display.max_rows',None)
# pd.set_option('display.max_columns',None)
# pd.set_option('display.width',1000)
constant_L = 10

def get_test_results_from_website():
    try:
        df = pd.read_csv(f'https://salsa.debian.org/benchmarksgame-team/benchmarksgame/-/raw/master/public/data/data.csv')
    except:
        raise RuntimeError("Error fetching web information.")
        sys.exit(1)
    else:
        df = df[df['status'] == 0]
        df = df.rename(columns={
            'name': 'test_name',
            'lang': 'language',
            'mem(KB)': 'mem',
            'size(B)': 'gz',
            'elapsed(s)': 'secs',
        })
        full_language_result_list = []
        for _, grouped_df in df.groupby('language'):
            full_language_result_list.append(grouped_df)

    return full_language_result_list

def get_local_extended_results():

    with open('./python-extension/result/result.json','r',encoding='utf-8') as f:
        raw = json.loads(f.read())

    # Wash the data into the specified format
    full_language_result_list = []
    for key, value in raw.items():
        # for each interpreter
        if value['executor_name'] == 'python':
            label = "python-control"
        else:
            label = value['executor_name']
        label = f"{label[0].upper()}{label[1:]}"
        
        this_language_result_list = []
        for test_name, test_results in value["items"].items():
            # for each test
            trimed = test_results[-10:]
            output_result_dict = {"test_name": test_name.replace('-', ''), "language": label}
            output_result_dict["secs"] = sum(trimed | Map(lambda x: round(x["time"],2))) / len(trimed)
            output_result_dict["mem"] = int(sum(trimed | Map(lambda x: x["mem"] )) / len(trimed) / 1024 + 0.5)
            output_result_dict["gz"] = 0
            output_result_dict["busy"] = 0
            output_result_dict["cpu load"] = 0
            this_language_result_list.append(output_result_dict)
        else:
            full_language_result_list.append(pd.DataFrame.from_records(this_language_result_list))

    return full_language_result_list

def convert_into_pandas_dataframe(full_language_result_list: List[List[Dict]], target_key: str) -> pd.DataFrame:
    # The repeated execution here creates logical redundancy, but given that we don't 
    # care about efficiency and for the sake of code-reviewer's logical simplicity, 
    # we take it in this way
    test_items_in_summary = set()
    for programming_language_results in full_language_result_list:
        assert len(programming_language_results) > 0
        test_items = set(programming_language_results["test_name"].tolist())
        test_items_in_summary.update(test_items)

    test_items_in_summary = sorted(list(test_items_in_summary)) # Fix order
    languages_in_summary = []
    array = []
    for programming_language_results in full_language_result_list:
        min_secs_idx = programming_language_results.groupby("test_name")["secs"].idxmin()
        results_dict = programming_language_results.loc[min_secs_idx].set_index("test_name")[target_key].to_dict()
        line = [] 
        # there's assertion above make sure non-empty
        languages_in_summary.append(programming_language_results["language"].iloc[0])

        for test_name in test_items_in_summary:
            line.append(results_dict.get(test_name, None))
        array.append(line)
    return pd.DataFrame(array, index=languages_in_summary, columns=test_items_in_summary, dtype=float)

def compute_language_ordered_value(
    frame: pd.DataFrame,
    weight_mode: int = 1
) -> pd.Series :
    # Proportional calibration of execution times for different machines
    frame.loc["Pypy"] = (frame.loc["Pypy"] * frame.loc["python3"] / frame.loc["Python-control"]).round(decimals=2)
    frame.loc["Pyston"] = (frame.loc["Pyston"] * frame.loc["python3"] / frame.loc["Python-control"]).round(decimals=2)
    frame.drop("Python-control", inplace = True)
    # A simple algorithm to adjust the weights so that extreme values are less influential
    min_line = frame.min()
    wdight_function_map = {
        1: lambda x: x.std().apply(lambda x: math.e**(- math.sqrt(x) / constant_L)),  # The greater the dispersion, the smaller the weight
        2: lambda x: x.mean().apply(lambda x: math.e**(- math.sqrt(x) / constant_L)),  # The greater the mean, the smaller the weight
        3: lambda x: x.mean().apply(lambda x: 1),   # normal mean
    }
    std_weight = wdight_function_map[weight_mode](frame)
    for language in frame.index:
        frame.loc[language] = frame.loc[language] * std_weight / min_line
        line_mask = frame.loc[language].apply(lambda x: x / x)
        masked_weight_sum = (std_weight * line_mask).sum()
        frame.loc[language] = frame.loc[language] / masked_weight_sum
    result = frame.mean(axis = 1)
    result_min = result.min()
    return result / result_min

def add_weighted_index(result_secs: pd.Series, result_mem: pd.Series) -> pd.DataFrame:
    view = pd.concat([result_secs, result_mem], keys=('secs', 'mem'), axis=1)
    view.sort_values(by='secs', inplace=True)
    view['secs_index'] = range(1, len(view)+1)
    view.sort_values(by='mem', inplace=True)
    view['mem_index'] = range(1, len(view)+1)
    view['weighted_score'] = view['secs_index'] * 0.8 + view['mem_index'] * 0.2 # weight: 80% speed + 20% memory
    view.sort_values(by='weighted_score', inplace=True)
    view['weighted_index'] = range(1, len(view)+1)
    view.drop(['weighted_score', 'mem_index', 'secs_index', 'mem'], axis=1, inplace=True)
    view['secs'] = view['secs'].round(decimals=2)
    view.sort_values(by='secs', inplace=True)
    return view

def render_json_output(view: pd.DataFrame) -> str:
    output = zip(view.index.tolist(), view.values.tolist()) | Map(lambda x: (x[0], *x[1])) | list
    return json.dumps(output)

def render(source_name, dest_name, **kwargs):
    with open(os.path.abspath(source_name), 'r', encoding='utf-8') as f:
        cont = f.read()
        for key, value in kwargs.items():
            cont = cont.replace(f"{{{{{key}}}}}", str(value))
    with open(os.path.abspath(dest_name), 'w', encoding='utf-8') as f:
        f.write(cont)

def webkit_render_images():

    def decode_base64(data: str) -> bytes:
        """Decode base64, padding being optional.

        :param data: Base64 data as an ASCII byte string
        :returns: The decoded byte string.
        """
        missing_padding = len(data) % 4
        if missing_padding != 0:
            data += "=" * (4 - missing_padding)
        return base64.decodebytes(data.encode("utf-8"))

    # get_chrome_driver
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(options=options)

    html_path = "file://" + os.path.abspath('./docs/index.html')
    driver.get(html_path)
    time.sleep(2)
    SNAPSHOT_JS = """
        var ele = document.querySelector("%s");
        var mychart = echarts.getInstanceByDom(ele);
        return mychart.getDataURL({
            type: '%s',
            pixelRatio: %s,
            excludeComponents: ['toolbox']
        });
    """
    content1 = driver.execute_script(SNAPSHOT_JS % ('#main','png', 2))
    content_array1 = content1.split(",")
    if len(content_array1) != 2:
        raise OSError(content_array1)
    image_data1 = decode_base64(content_array1[1])
    content2 = driver.execute_script(SNAPSHOT_JS % ('#main2','png', 2))
    content_array2 = content2.split(",")
    if len(content_array2) != 2:
        raise OSError(content_array2)
    image_data2 = decode_base64(content_array2[1])

    def load_bytes_string_as_img_object(image_data: bytes) -> PngImageFile:
        image_file = BytesIO()
        image_file.write(image_data)
        image_file.seek(0)
        return Image.open(image_file)

    # Merge two images
    foreground1 = load_bytes_string_as_img_object(image_data1)
    foreground2 = load_bytes_string_as_img_object(image_data2)
    background = Image.new('RGBA', (foreground1.size), (255, 255, 255, 255))
    background.paste(foreground2, (0, 0), foreground2)
    background.paste(foreground1, (0, 0), foreground1)
    background.save('ranking.png', 'png')
    
    import sys
    driver.quit()
    print("Rendered")
    sys.exit(0)

if __name__ == '__main__':
    full_language_result_list = get_test_results_from_website()
    full_language_result_list.extend(get_local_extended_results())

    frame_secs = convert_into_pandas_dataframe(full_language_result_list, "secs")
    frame_mem = convert_into_pandas_dataframe(full_language_result_list, "mem")
    result_secs = compute_language_ordered_value(frame_secs, weight_mode=2)
    result_mem = compute_language_ordered_value(frame_mem, weight_mode=3)
    view = add_weighted_index(result_secs, result_mem)
    output = render_json_output(view)
    render(
        "renderlogic_template.js", 
        "./docs/renderlogic.js", 
        raw_data=output, 
        render_date=datetime.date.today().strftime('%Y-%m-%d')
    )
    webkit_render_images()
