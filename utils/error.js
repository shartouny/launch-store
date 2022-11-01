export const stripeError = (error) => {
  if (error.code == '"card_declined"') return { title: 'card error', message: 'insufficient_funds' }
}
