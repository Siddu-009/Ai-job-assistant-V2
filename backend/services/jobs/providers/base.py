from abc import ABC, abstractmethod
from typing import List

from services.jobs.models import Job


class JobProvider(ABC):

    name: str = "Unknown"

    @abstractmethod
    async def search(
        self,
        keyword: str = "",
        location: str = "",
        experience: str = ""
    ) -> List[Job]:
        """
        Return normalized Job objects.
        """
        raise NotImplementedError