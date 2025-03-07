const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("en-GB").format(amount);
};

export default formatMoney;
