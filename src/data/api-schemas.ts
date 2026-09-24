export const isCustomerSchema = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false;
  const customer = value as Record<string, unknown>;
  return ['id', 'firstName', 'lastName', 'username'].every(
    (key) => key in customer
  );
};

export const isAccountSchema = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false;
  const account = value as Record<string, unknown>;
  return ['id', 'customerId', 'type', 'balance'].every((key) => key in account);
};

export const isTransactionSchema = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false;
  const transaction = value as Record<string, unknown>;
  return ['id', 'accountId', 'type', 'amount', 'date'].every(
    (key) => key in transaction
  );
};
