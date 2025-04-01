export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

export const abi = [
    {
      inputs: [
        { internalType: "string[800]", name: "general_svg_uri_", type: "string" },
        { internalType: "string[800]", name: "vip_svg_uri_", type: "string" },
        { internalType: "uint256", name: "base_ticket_price_", type: "uint256" },
        { internalType: "uint256", name: "ticket_price_increment_", type: "uint256" },
        { internalType: "uint256", name: "upgrade_fee_", type: "uint256" },
        { internalType: "uint256", name: "max_tickets_", type: "uint256" }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [],
      name: "mint_ticket",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [],
      name: "get_current_price",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { internalType: "uint256", name: "token_id", type: "uint256" }
      ],
      name: "upgrade_ticket",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "uint256", name: "token_id", type: "uint256" }
      ],
      name: "check_in",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "uint256", name: "token_id", type: "uint256" }
      ],
      name: "tokenURI",
      outputs: [
        { internalType: "string", name: "", type: "string" }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { internalType: "string", name: "svg", type: "string" }
      ],
      name: "svg_to_uri",
      outputs: [
        { internalType: "string", name: "", type: "string" }
      ],
      stateMutability: "pure",
      type: "function"
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint256", name: "token_id", type: "uint256" },
        { indexed: false, internalType: "address", name: "buyer", type: "address" },
        { indexed: false, internalType: "uint256", name: "price", type: "uint256" }
      ],
      name: "TicketMinted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint256", name: "token_id", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "new_category", type: "uint256" }
      ],
      name: "TicketUpgraded",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint256", name: "token_id", type: "uint256" },
        { indexed: false, internalType: "address", name: "attendee", type: "address" }
      ],
      name: "TicketCheckedIn",
      type: "event"
    },
    {
        stateMutability: "view",
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
      }
  ];