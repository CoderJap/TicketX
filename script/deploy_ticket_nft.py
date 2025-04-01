from src import ticket_nft
from moccasin.boa_tools import VyperContract
import base64

BASE_TICKET_PRICE= 50000000000000000
TICKET_PRICE_INCREMENT= 10000000000000000
UPGRADE_FEE= 20000000000000000
MAX_TICKETS=1000

def deploy_ticket_nft()->VyperContract:
    general_svg_uri=""

    vip_svg_uri=""
    with open("./images/happy.svg","r") as f:
        general_svg = f.read()
        general_svg_uri = svg_to_base64_uri(general_svg)
        # print(happy_svg_uri)
    with open("./images/sad.svg","r") as f:
        vip_svg=f.read()
        vip_svg_uri=svg_to_base64_uri(vip_svg)
        # print(sad_svg_uri)

    ticket_nft_contract:VyperContract = ticket_nft.deploy(general_svg_uri,vip_svg_uri,BASE_TICKET_PRICE,TICKET_PRICE_INCREMENT,UPGRADE_FEE,MAX_TICKETS)
    # ticket_nft_contract.mint_ticket(value = )
    # ticket_nft_contract.flip_mood(0)
    # print (f"TokenURI: {ticket_nft_contract.tokenURI(0)}")
    # print(ticket_nft_contract.abi) 
    return ticket_nft_contract

def moccasin_main():
    deploy_ticket_nft()

def svg_to_base64_uri(svg):
    svg_bytes=svg.encode("utf-8")
    base64_svg = base64.b64encode(svg_bytes).decode("utf-8")
    return f"data:image/svg+xml;base64,{base64_svg}"