from abc import ABC, abstractmethod

from docx import Document


class BaseResumeTemplate(ABC):
    """
    Base class for all resume templates.
    """

    def __init__(self, data):
        self.data = data
        self.doc = Document()

    @abstractmethod
    def build(self):
        """
        Build the complete resume.
        """
        pass

    def document(self):
        return self.doc