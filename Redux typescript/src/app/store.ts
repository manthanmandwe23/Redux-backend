import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/auth_slice";
import productSlice from "../features/products/product_slice";
import cartSlice from "../features/cart/cart_slice";
import orderSlice from "../features/orders/order_slice";

export const store = configureStore({
  //here user, product are names we can keep on , it can be anything  this names becomes becomes the key used to access Redux state like user.state
  reducer: {
    //here authSlice = userSlice.reducer because we export userSlice.reducer and import it as authSlice
    //so it basically becomes user: authSlice.reducer and when we do this it means
    //"In my Redux store, create a section called user, and let authSlice.reducer control that section."
    user: authSlice,
    product: productSlice,
    order: orderSlice,
    cart: cartSlice,
  },
});

//it means "Take whatever state my Redux store currently has and call that type RootState." so here now RootState have Redux Store state so if we do state.product TypeScript knows: product is the product slice. state.product.loading TypeScript knows: loading is a boolean.

//why we need it because when we fetch data from redux using useSelector hook so to fetch data useSelector also need to know what type of data is coming from redux because we are using ts like redux have loading, error, and product so what type each has

//In Redux, state means the current data/state stored in the Redux store.
/**
 * For example:
state.product.product
means:
Current product data stored inside the product slice.

And:
state.product.loading
means:
Current loading status.

state.product.loading you say it means Current loading status. so it means wheather it is true or false
 */
export type RootState = ReturnType<typeof store.getState>;

 // useDispatch() tells Redux to perform an action
 /**
  * ok so basically it is like we want redux to execute thunk and perform action and for that we use useDispatch hook and this hook provide us a dispatch func which comes from redux store (it like instruction from goverment office and to bring instruction i am sending my own person) but since we are using a ts we need to know what will we the type of dispatch func and here when we say type of func it mean what arguments func are recieving what is its type and what is type of data func returning so to get the type of dispatch func we do this  typeof store.dispatch;
  * 
  * type AppDispatch = typeof store.dispatch; basically says:
"TypeScript, take the actual dispatch function from my Redux store and figure out its function type."

const useAppDispatch = useDispatch.withTypes<AppDispatch>();
means: "Make my useDispatch hook understand this exact dispatch type."

 useDispatch.withTypes<AppDispatch>(); so this means useDispatch is a type of AppDispatch
  */
export type AppDispatch = typeof store.dispatch;


//dispatch tells Redux to perform an action.
  // useDispatch() is a React-Redux hook that gives us the dispatch function to send actions (or thunks) to the Redux Store.

  // useDispatch() tells Redux to perform an action, while useSelector() reads the latest data from the Redux Store.
  //so when we need to read data from from redux we use useSelector hook

  //For example: dispatch(getProducts());
  //   Redux, execute the getProducts async thunk."
  //     That thunk will:
  //     Call the backend API
  //     Wait for the response
  //     Update the Redux Store

