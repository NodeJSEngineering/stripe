

exports.create = function(req, res, next) {
    const stripeToken = req.body.stripeToken;
    const price = Helper.getPrice(req.body.order);
    const priceInPence = price * 100;
 stripe.charges.create({
       amount: priceInPence,
       currency: 'usd',
       source: stripeToken,
       capture: false,  // note that capture: false
    }).then(chargeObject => {
        // makeOrderCreation(req, res, next, chargeObject)
        return createOrder(req, res, next).then(order => {
            res.status(200).json(order).end();
                // we will capture the charge here
            stripe.charges.capture(charge.id)
               .then(res => res)
               .catch(err => err)
         })
     }).catch(error => {
        // handleError(error);
             // we will refund the charge here
       res.status(400).json(err).end();
       stripe.refunds.create({charge: charge.id})
         .then(res => res)
         .catch(err => err);
     });

     
 };
