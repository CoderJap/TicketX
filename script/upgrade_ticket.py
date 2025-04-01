# from src import deploy_ticket_nft
from moccasin.config import get_active_network
from script.deploy_ticket_nft import UPGRADE_FEE
def upgrade_ticket():
    active_network = get_active_network()
    token_idi:int=int(input("enter token id: "))
    # coffee = active_network.get_latest_contract_checked("buy_me_a_coffee")
    ticket = active_network.manifest_named("ticket_nft")
    print(f"Working with contract: {ticket.address}")
    ticket.upgrade_ticket(token_idi,value=UPGRADE_FEE)
    print (f"TokenURI: {ticket.tokenURI(token_idi)}")

def moccasin_main():
    return upgrade_ticket()