# Calculate displayed rental costs from the current equipment rate

Rental requests do not store a historical rental rate. Use the equipment item's current rate for every displayed request total instead of saving its rate at creation. This retains the current API representation and accepts that rate changes also change displayed totals for older requests. The original rate cannot be recovered from the rental record alone.
