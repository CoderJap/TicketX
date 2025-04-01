# from src import deploy_ticket_nft
from moccasin.config import get_active_network

def current_price():
    active_network = get_active_network()
    # coffee = active_network.get_latest_contract_checked("buy_me_a_coffee")
    ticket = active_network.manifest_named("ticket_nft")
    print(f"Working with contract: {ticket.address}")
    current_cost=ticket.get_current_price()
    print (f"current price: {current_cost}")
    return current_cost

def moccasin_main():
    return current_price()