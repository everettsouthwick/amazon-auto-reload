class Card(object):
    card_number = ""
    reload_amount = 0.50
    reload_times = 1

    def __init__(self, card_number, reload_amount, reload_times):
        self.card_number = card_number
        self.reload_amount = reload_amount
        self.reload_times = reload_times