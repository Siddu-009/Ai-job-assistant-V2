from .templates.classic import build_classic_resume
from .templates.modern import build_modern_resume
from .templates.executive import build_executive_resume
from .templates.minimal import build_minimal_resume


def build_resume(data, template="classic"):

    if not isinstance(data, dict):
        raise TypeError(
            "Resume data must be a dictionary."
        )

    builders = {
        "classic": build_classic_resume,
        "modern": build_modern_resume,
        "executive": build_executive_resume,
        "minimal": build_minimal_resume,
    }

    builder = builders.get(
        template,
        build_classic_resume
    )

    return builder(data)