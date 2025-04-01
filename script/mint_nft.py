# from src import deploy_ticket_nft
from moccasin.config import get_active_network

def mintNFT():
    active_network = get_active_network()
    # coffee = active_network.get_latest_contract_checked("buy_me_a_coffee")
    ticket = active_network.manifest_named("ticket_nft")
    print(f"Working with contract: {ticket.address}")
    current_price = ticket.get_current_price()

    ticket.mint_ticket(value=current_price)
    latest_token_id = ticket.totalSupply() - 1
    print (f"TokenURI: {ticket.tokenURI(latest_token_id)}")
    return ticket

def moccasin_main():
    mintNFT()