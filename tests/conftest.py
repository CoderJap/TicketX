import pytest
from script import deploy_ticket_nft


@pytest.fixture(scope="session")
def mood_nft():
    return deploy_ticket_nft()