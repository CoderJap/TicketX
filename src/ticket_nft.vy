# pragma version 0.4.0
"""
@license MIT
@title Ticket NFT
"""

from snekmate.tokens import erc721
from snekmate.auth import ownable as ow
from snekmate.utils import base64

initializes: ow
initializes: erc721[ownable := ow]

exports: (
    erc721.owner,
    erc721.balanceOf,
    erc721.ownerOf,
    erc721.getApproved,
    erc721.approve,
    erc721.setApprovalForAll,
    erc721.transferFrom,
    erc721.safeTransferFrom,
    # erc721.tokenURI, 
    erc721.totalSupply,
    erc721.tokenByIndex,
    erc721.tokenOfOwnerByIndex,
    erc721.burn,
    # erc721.safe_mint, 
    # erc721.set_minter,
    erc721.permit,
    erc721.DOMAIN_SEPARATOR,
    erc721.transfer_ownership,
    erc721.renounce_ownership,
    erc721.name,
    erc721.symbol,
    erc721.isApprovedForAll,
    erc721.is_minter,
    erc721.nonces,
)

flag Category:
    VIP 
    GENERAL 

# ------------------------------------------------------------------
#                         STATE VARIABLES
# ------------------------------------------------------------------
NAME: constant(String[25]) = "Ticket NFT"
SYMBOL: constant(String[5]) = "TNFT"
BASE_URI: public(constant(String[80])) = "ipfs://"
EIP_712_VERSION: constant(String[20]) ="1"

GENERAL_SVG_URI: immutable(String[800])
VIP_SVG_URI: immutable(String[800])
FINAL_STRING_SIZE: constant(uint256) = (4 * base64._DATA_OUTPUT_BOUND)+ 80
JSON_BASE_URI: constant(String[29]) = "data:application/json;base64,"
JSON_BASE_URI_SIZE: constant(uint256) = 29
IMG_BASE_URI_SIZE: constant(uint256) = 26
IMG_BASE_URI: constant(String[IMG_BASE_URI_SIZE])="data:image/svg+xml;base64,"
OWNER: public(immutable(address))


# --- Ticketing-specific state variables ---
# Base ticket price (in wei)
base_ticket_price: public(uint256)
# Price increase per minted ticket (dynamic pricing)
ticket_price_increment: public(uint256)
# Fee required to upgrade a general ticket to VIP
upgrade_fee: public(uint256)
# Maximum number of tickets available for the event
max_tickets: public(uint256)

# Mapping from token id to ticket type (GENERAL or VIP)
token_id_to_category: public(HashMap[uint256, Category])
# Mapping for attendance tracking: whether a ticket has been checked in
token_id_to_checked_in: public(HashMap[uint256, bool])

# ------------------------------------------------------------------
#                            EVENTS
# ------------------------------------------------------------------
event TicketMinted:
    token_id: uint256
    buyer: address
    price: uint256

event TicketUpgraded:
    token_id: uint256
    new_category: Category

event TicketCheckedIn:
    token_id: uint256
    attendee: address

# ------------------------------------------------------------------
#                            FUNCTIONS
# ------------------------------------------------------------------
@deploy
def __init__(general_svg_uri_: String[800],
    vip_svg_uri_: String[800],
    base_ticket_price_: uint256,
    ticket_price_increment_: uint256,
    upgrade_fee_: uint256,
    max_tickets_: uint256):
    ow.__init__()
    erc721.__init__(NAME, SYMBOL, BASE_URI, NAME, EIP_712_VERSION)
    GENERAL_SVG_URI = general_svg_uri_
    VIP_SVG_URI = vip_svg_uri_
    self.base_ticket_price = base_ticket_price_
    self.ticket_price_increment = ticket_price_increment_
    self.upgrade_fee = upgrade_fee_
    self.max_tickets = max_tickets_
    OWNER=msg.sender

@external
@payable
def mint_ticket():
    """
    Mint a new ticket NFT. The current ticket price is dynamic—
    it increases with every ticket minted. Excess funds are refunded.
    """
    token_id: uint256 = erc721._counter
    # Ensure we haven’t exceeded the maximum ticket supply
    assert token_id < self.max_tickets, "Max ticket supply reached"

    current_price: uint256 = self._get_current_price()
    assert msg.value >= current_price, "Insufficient payment for ticket"

    # Mint the ticket as a GENERAL ticket and mark it as not yet checked in
    erc721._counter = token_id + 1
    self.token_id_to_category[token_id] = Category.GENERAL
    self.token_id_to_checked_in[token_id] = False
    erc721._safe_mint(msg.sender, token_id, b"")

    log TicketMinted(token_id, msg.sender, current_price)

    # Refund any excess payment
    excess: uint256 = msg.value - current_price
    if excess > 0:
        raw_call(msg.sender, b"", value = excess)

@external
@view
def get_current_price() -> uint256:
    return self._get_current_price()
    


@internal
@view
def _get_current_price() -> uint256:
    """
    Returns the current ticket price.
    Price = base_ticket_price + (tickets_sold * ticket_price_increment)
    """
    return self.base_ticket_price + (erc721._counter * self.ticket_price_increment)

@external
@payable
def upgrade_ticket(token_id: uint256):
    """
    Upgrade a GENERAL ticket to VIP.
    Only the ticket owner (or an approved operator) may call this.
    An upgrade fee must be paid; any excess is refunded.
    """
    assert erc721._is_approved_or_owner(msg.sender, token_id), "Not authorized"
    assert self.token_id_to_category[token_id] == Category.GENERAL, "Ticket already VIP"
    assert msg.value >= self.upgrade_fee, "Insufficient upgrade fee"

    self.token_id_to_category[token_id] = Category.VIP
    log TicketUpgraded(token_id, Category.VIP)

    excess: uint256 = msg.value - self.upgrade_fee
    if excess > 0:
        raw_call(msg.sender, b"", value = excess)

@external
def check_in(token_id: uint256):
    """
    Record attendance by marking the ticket as checked in.
    Only the ticket owner (or an approved operator) may check in.
    """
    assert erc721._is_approved_or_owner(msg.sender, token_id), "Not authorized"
    assert not self.token_id_to_checked_in[token_id], "Already checked in"
    self.token_id_to_checked_in[token_id] = True
    log TicketCheckedIn(token_id, msg.sender)

@external
@view
def tokenURI(token_id: uint256) -> String[FINAL_STRING_SIZE]:
    """
    Generates a tokenURI that includes JSON metadata about the ticket,
    such as its type (GENERAL or VIP) and whether the holder has checked in.
    """
    image_uri: String[800] = GENERAL_SVG_URI
    if self.token_id_to_category[token_id] == Category.VIP:
        image_uri = VIP_SVG_URI

    ticket_type: String[10] = "GENERAL"
    if self.token_id_to_category[token_id] == Category.VIP:
        ticket_type = "VIP"

    checked_in_str: String[3] = "No"
    if self.token_id_to_checked_in[token_id]:
        checked_in_str = "Yes"

    json_string: String[1024] = concat(
        '{"name":"Ticket NFT", ',
        '"description":"This NFT grants access to the event.", ',
        '"attributes": [',
            '{"trait_type": "Ticket Type", "value": "', ticket_type, '"}, ',
            '{"trait_type": "Checked In", "value": "', checked_in_str, '"}',
        '], "image":"', image_uri, '"}'
    )
    json_bytes: Bytes[1024] = convert(json_string, Bytes[1024])
    encoded_chunks: DynArray[String[4], base64._DATA_OUTPUT_BOUND] = base64._encode(json_bytes, True)

    result: String[FINAL_STRING_SIZE] = JSON_BASE_URI
    counter: uint256 = JSON_BASE_URI_SIZE
    for encoded_chunk: String[4] in encoded_chunks:
        result = self.set_indice_truncated(result, counter, encoded_chunk)
        counter += 4
    return result

@external
@pure
def svg_to_uri(svg: String[1024]) -> String[FINAL_STRING_SIZE]:
    svg_bytes: Bytes[1024] = convert(svg, Bytes[1024])
    encoded_chunks: DynArray[
        String[4], base64._DATA_OUTPUT_BOUND
    ] = base64._encode(svg_bytes, True)
    result: String[FINAL_STRING_SIZE] = JSON_BASE_URI

    counter: uint256 = IMG_BASE_URI_SIZE
    for encoded_chunk: String[4] in encoded_chunks:
        result = self.set_indice_truncated(result, counter, encoded_chunk)
        counter += 4
    return result

@external
def withdraw():
    """
    Withdraw all funds from the contract.
    Only the contract owner may call this function.
    """
    assert msg.sender == OWNER, "Not owner"
    raw_call(msg.sender, b"", value = self.balance)

# ------------------------------------------------------------------
#                       INTERNAL FUNCTIONS
# ------------------------------------------------------------------
@internal
@pure
def set_indice_truncated(
    result: String[FINAL_STRING_SIZE], index: uint256, chunk_to_set: String[4]
) -> String[FINAL_STRING_SIZE]:
    """
    We set the index of a string, while truncating all values after the index
    """
    buffer: String[FINAL_STRING_SIZE * 2] = concat(
        slice(result, 0, index), chunk_to_set
    )
    return abi_decode(abi_encode(buffer), (String[FINAL_STRING_SIZE]))