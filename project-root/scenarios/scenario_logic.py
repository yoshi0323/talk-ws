def evaluate_condition(user_input, csv_value, condition_type):
    if condition_type == "一致している時":
        return user_input == csv_value
    elif condition_type == "かつ":
        return all(user_input == v for v in csv_value)
    elif condition_type == "または":
        return any(user_input == v for v in csv_value)
    return False

def handle_scenario(user_input, csv_header, condition_type, csv_data):
    for row in csv_data:
        csv_value = row[csv_header]
        if evaluate_condition(user_input, csv_value, condition_type):
            return f"Condition matched for {csv_value}"
    return "No match found"
