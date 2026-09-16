INDIAN_PRIORITY = {

    # Telangana
    "hyderabad": [
        "Hyderabad",
        "Secunderabad",
        "Telangana",
        "India"
    ],

    # Karnataka
    "bangalore": [
        "Bangalore",
        "Bengaluru",
        "Karnataka",
        "India"
    ],

    # Tamil Nadu
    "chennai": [
        "Chennai",
        "Tamil Nadu",
        "India"
    ],

    # Maharashtra
    "mumbai": [
        "Mumbai",
        "Navi Mumbai",
        "Maharashtra",
        "India"
    ],

    "pune": [
        "Pune",
        "Maharashtra",
        "India"
    ],

    # Delhi NCR
    "delhi": [
        "New Delhi",
        "Delhi",
        "Noida",
        "Gurgaon",
        "Gurugram",
        "NCR",
        "India"
    ],

    # Andhra Pradesh
    "visakhapatnam": [
        "Visakhapatnam",
        "Vizag",
        "Andhra Pradesh",
        "India"
    ],

    "vijayawada": [
        "Vijayawada",
        "Andhra Pradesh",
        "India"
    ],

    # Kerala
    "kochi": [
        "Kochi",
        "Cochin",
        "Kerala",
        "India"
    ],

    # Gujarat
    "ahmedabad": [
        "Ahmedabad",
        "Gujarat",
        "India"
    ],

    # Odisha
    "bhubaneswar": [
        "Bhubaneswar",
        "Odisha",
        "India"
    ],

    # West Bengal
    "kolkata": [
        "Kolkata",
        "West Bengal",
        "India"
    ],

    # Madhya Pradesh
    "indore": [
        "Indore",
        "Madhya Pradesh",
        "India"
    ],

    # Chandigarh
    "chandigarh": [
        "Chandigarh",
        "India"
    ],

    # Goa
    "goa": [
        "Goa",
        "Panaji",
        "India"
    ],

    # Remote
    "remote": [
        "Remote",
        "Remote India",
        "India Remote",
        "Work From Home",
        "WFH",
        "Anywhere",
        "India"
    ],

    "mysore": [
        "Mysore",
        "Mysuru",
        "Karnataka",
        "India"
    ],

    "coimbatore": [
        "Coimbatore",
        "Tamil Nadu",
        "India"
    ],

    "nagpur": [
        "Nagpur",
        "Maharashtra",
        "India"
    ]

}


def expand_location(location: str):

    if not location:
        return ["India"]

    key = location.lower().strip()

    # Handle aliases
    aliases = {
        "vizag": "visakhapatnam",
        "bengaluru": "bangalore",
        "gurugram": "delhi",
        "noida": "delhi",
        "secunderabad": "hyderabad",
        "cochin": "kochi",
        "wfh": "remote"
    }

    key = aliases.get(key, key)

    if key in INDIAN_PRIORITY:
        return INDIAN_PRIORITY[key]

    return [
        location,
        "India"
    ]