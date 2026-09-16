from services.jobs.providers.arbeitnow import ArbeitnowProvider
from services.jobs.providers.remoteok import RemoteOKProvider
from services.jobs.providers.remotive import RemotiveProvider
from services.jobs.providers.greenhouse import GreenhouseProvider
from services.jobs.providers.lever import LeverProvider
from services.jobs.providers.ashby import AshbyProvider
from services.jobs.providers.smartrecruiters import SmartRecruitersProvider

PROVIDERS = [

    ArbeitnowProvider(),

    RemoteOKProvider(),

    RemotiveProvider(),

    GreenhouseProvider(),

    LeverProvider(),

    AshbyProvider(),

    SmartRecruitersProvider(),

]