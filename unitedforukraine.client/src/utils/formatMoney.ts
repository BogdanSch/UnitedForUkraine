const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-GB").format(amount);
};

export default formatMoney;
