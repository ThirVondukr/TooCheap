import json
import shutil
from pathlib import Path
from zipfile import ZipFile

import flea

AUTHOR = "Doctor"
MOD_NAME = "TooCheap"
VERSION = "0.1.2"
MOD_ID = f"{AUTHOR}-{MOD_NAME}-{VERSION}"

flea.update_prices()

build_dir = Path("./build")
if build_dir.exists():
    shutil.rmtree(build_dir)

build_dir.mkdir(exist_ok=True)

includes = [
    Path("./dist"),
    Path("./resources"),
]

for path in includes:
    if path.is_dir():
        shutil.copytree(path, build_dir.joinpath(path.name))
    else:
        shutil.copy(path, build_dir.joinpath(path.name))

mod_config_path = Path("./mod.config.json")
with mod_config_path.open(mode="r") as mod_config_file:
    mod_config = json.load(mod_config_file)
    mod_config["version"] = VERSION
    mod_config["author"] = AUTHOR
    mod_config["name"] = MOD_NAME

with build_dir.joinpath(mod_config_path).open("w") as mod_config_file:
    json.dump(mod_config, mod_config_file, indent=4)

zip_path = build_dir.joinpath(f"{MOD_ID}.zip")
with ZipFile(zip_path, "w") as zipfile:
    for path in (p for p in build_dir.rglob("*") if p != zip_path):
        zipfile.write(path, arcname=Path(MOD_ID, path.relative_to(build_dir)))
