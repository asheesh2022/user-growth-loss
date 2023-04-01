try {
  const userId = req.params.userId;
  // Get user from the user collection
  const user = await User.findById(userId);

  const walletTransactions = await WalletTransaction.find({ userId });

  const goldTransactions = await GoldTransaction.find({ userId });

  const netFundAdded = walletTransactions.reduce((total, transaction) => {
    if (transaction.status === 'SUCCESS' && transaction.type === 'CREDIT') {
      return total + transaction.amount;
    } else {
      return total;
    }
  }, 0);

  const currentFund = user.runningBalance.wallet;

  const netGrowthOrLoss = currentFund - netFundAdded;

  const gainOrLossPercentage = (netGrowthOrLoss / netFundAdded) * 100;

  // Return response
  res.status(200).json({
    netFundAdded,
    currentFund,
    netGrowthOrLoss,
    gainOrLossPercentage
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
