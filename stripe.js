const STRIPE_TEST_SECRET_KEY = "sk_test_7ejhGftaNv6YKX1TGUoyrDOS00EKq9xr9j"//your Stripe key here
const stripe = require('stripe')(STRIPE_TEST_SECRET_KEY);

//express middleware
async function getAllPlans(req, res, next){

    //get all plans, expand keyword will also return the contents of the product this plan is attached to
    const basicPlan = await stripe.plans.create({
        amount: 1, 
        interval: "month", 
        product: {
            name : "AcmeBot Basic"
        },
        currency: "USD"
    })
    const premiumPlan = await stripe.plans.create({
        amount: 2, 
        interval: "month", 
        product: {
            name : "AcmeBot Premium"
        },
        currency: "USD"
    })
    console.log(`Stripe Plans that were Created:`);
    console.log(`AcmeBot Basic, Plan ID: ${basicPlan.id}, Amount: $${basicPlan.amount/100}/${basicPlan.interval}, Product ID: ${basicPlan.product}`)
    console.log(`AcmeBot Premium, Plan ID: ${premiumPlan.id}, Amount: $${premiumPlan.amount/100}/${premiumPlan.interval}, Product ID: ${premiumPlan.product}`)

    const plans = await stripe.plans.list({expand: ["data.product"]});
    res.json(plans);
}


//see it in action
const req = {}; // req not used
const res = {
    json : function(payload){
        console.log("All Stripe Plans:")
        for(let plan of payload.data){
            console.log(`Plan ${plan.id}, Name: ${plan.product.name}, Amount: ${plan.amount/100}/${plan.interval}`)
        }
        console.log("payload:", payload);
}
};
const next = function(){};
getAllPlans(req, res, next)