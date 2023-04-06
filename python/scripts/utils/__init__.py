import argparse
import importlib.util
import sys
import typing

import typing_extensions  # Remove after dropping Python 3.7

QT_DEPENDENCY_ARG = "vscode_extension_qt_dependency"

SupportedQtDependencies = typing.Optional[
    typing_extensions.Literal["PySide6", "PySide2", "PyQt6", "PyQt5"]
]


def is_installed(name: str) -> bool:
    return name in sys.modules or importlib.util.find_spec(name) is not None


def parse_qt_dependency() -> SupportedQtDependencies:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument(
        f"--{QT_DEPENDENCY_ARG}",
        required=False,
    )

    dep = vars(parser.parse_known_args()[0])[QT_DEPENDENCY_ARG]
    if dep is not None:
        sys.argv.remove(f"--{QT_DEPENDENCY_ARG}")
        sys.argv.remove(dep)

        return dep
    return None
