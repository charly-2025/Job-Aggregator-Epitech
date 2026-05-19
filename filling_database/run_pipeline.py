from ast import arg
from html import parser
import subprocess
import sys


PIPELINE = [
    "1_data_scrapping/main.py",
    "2_data_cleaning/main.py",
    "3_data_storage/main.py",
    "4_data_correction/main.py"
]

def run_step(script):
    print(f"run script : {script}")
    
    cmd = [sys.executable, script]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True
    )

    print(result.stdout)

    if result.returncode != 0:
        print("Error :", script)
        print(result.stderr)
        return False

    print("Finish script :", script)
    return True


def main():
    print("Start data collection pipeline")

    for step in PIPELINE:
        ok = run_step(step)
        if not ok:
            print("pipeline stop")
            return

    print("Pipeline run success")


if __name__ == "__main__":
    main()