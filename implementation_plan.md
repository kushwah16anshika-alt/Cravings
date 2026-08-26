# Full Project Audit, Bug Fix & UI Polish Plan

A comprehensive plan to fix all identified backend, frontend, routing, authentication, and database bugs, resolve asset loading issues, normalize user roles, and enhance the UI/UX across the Cravings platform.

## Summary of Identified Issues

1. **Authentication & Authorization / Role Inconsistency**:
   - Database `UserSchema.userType` enum is `["admin", "user", "rider", "restaurant"]`.
   - `order.controller.js`, `UserDashboard.jsx`, `Cart.jsx`, and `MenuItemCard.jsx` check `userType === "customer"` or `role === "customer"`, causing all logged-in regular users to be blocked with "Access Denied" or "Only customer can place order".
   - `RiderAuthProtect` checked cookie `req.cookies.token` instead of `req.cookies.Oreo`.
   - `SendOtp` referenced undefined `existingUser.fullName` instead of `existingUser.fullname`.
2. **Database & Schema Inconsistencies**:
   - `UserSchema` defines `fullname` (lowercase) while several controllers/forms read/write `fullName`.
   - `Customer.addressBook` vs `User`: `GetAddressBook`, `AddAddress`, `UpdateAddress`, `DeleteAddress` in `user.controller.js` mixed up `User` and `Customer` schema fields and failed to manipulate `Customer.addressBook` subdocuments.
   - `GetAllOrders` queried `Order.find({ user: currentUser._id })`, but `Order` schema uses `customerId`.
   - `payment.controller.js` `getCustomerOrder` queried `Customer.findOne({ customerId: userId })`, failing if `Customer` document was not created upon registration.
   - `Restaurant` schema had rigid `required: true` on all subdocuments (banking, documents, cover photo), which caused validation errors during step-by-step onboarding in `RestaurantUpdateInfo`.
   - `RestaurantUpdateLegalInfo` tried to set `existingRestaurant.legal = ...`, which is not in the `Restaurant` schema (should be `documents.legalName` & `documents.companyType`).
3. **Routing & API Mismatches**:
   - `Feedback.jsx` calls `POST /public/feedback`, which was missing in `public.route.js` and `public.controller.js`.
   - `ContactUs.jsx` had a mock submit handler without calling `POST /public/contact-us`.
   - `App.jsx` lacked routes for `/feedback` and `/help-center`.
   - `PresonalInformation.jsx` in restaurant dashboard called `/restaurant/update-profile` (commented out in backend), should use `/common/edit-profile`.
   - `GetRestaurantDetails` in `public.controller.js` 404'd when no `Menu` document existed yet for a restaurant.
4. **Missing Assets & Broken JSX**:
   - `RestaurantDetailsPage.jsx`, `RestaurantSetting.jsx`, and `Order.jsx` tried to render imported `.gif` file as a JSX component `<Loader />`, causing React rendering issues.
   - `FeedbackPage.jpeg`, `foodTable.webp`, and `HelpPage.jpg` background image references pointed to missing root `/` paths instead of proper Vite imports or assets.
   - Dead/commented-out blocks duplicated in multiple components.
5. **CSS Variables & Design**:
   - 500+ classes used `--color-base-100`, `--color-base-200`, `--color-base-300`, `--color-primary`, etc., but `index.css` defined `--primary` without `--color-` prefixes.
   - Theme variables will be properly mapped in `index.css` with a modern, Gen-Z friendly, clean color palette and polished animations.

---

## Proposed Changes

### Backend

#### [MODIFY] [user.model.js](file:///d:/project/Cravings/server/src/models/user.model.js)
- Add virtual `fullName` getter and setter to `UserSchema` for seamless compatibility between `fullname` and `fullName`.
- Keep `userType` enum `["admin", "user", "rider", "restaurant"]` and support `"customer"` as alias in queries if needed.

#### [MODIFY] [restaurant.model.js](file:///d:/project/Cravings/server/src/models/restaurant.model.js)
- Make subdocument fields in `documents`, `financialDetails`, `coverImage`, and `address` optional with safe defaults to allow step-by-step onboarding without Mongoose validation errors.

#### [MODIFY] [auth.middleware.js](file:///d:/project/Cravings/server/src/middlewares/auth.middleware.js)
- Fix `RiderAuthProtect` to check `req.cookies.Oreo || req.cookies.token`.
- Ensure role checks handle `"rider"`, `"restaurant"`, and `"admin"`.

#### [MODIFY] [auth.controller.js](file:///d:/project/Cravings/server/src/controllers/auth.controller.js)
- In `SendOtp`, use `existingUser.fullname || existingUser.fullName || "User"`.
- Support lowercase/trimming for email across auth endpoints.

#### [MODIFY] [public.route.js](file:///d:/project/Cravings/server/src/routers/public.route.js) & [public.controller.js](file:///d:/project/Cravings/server/src/controllers/public.controller.js)
- Add `POST /public/feedback` route and `FeedbackForm` controller using the `Feedback` model.
- Update `GetRestaurantDetails` to fetch `Restaurant.findById(restaurantId)` and then query `Menu.findOne({ restaurantId })`, returning populated data even if menu is initially empty.

#### [MODIFY] [user.controller.js](file:///d:/project/Cravings/server/src/controllers/user.controller.js)
- Rewrite `GetAddressBook`, `AddAddress`, `UpdateAddress`, and `DeleteAddress` to properly operate on `Customer.addressBook` array for the authenticated user (auto-creating `Customer` if not present), returning `data: customer.addressBook`.
- Fix `GetAllOrders` to find orders by `customerId: { $in: [currentUser._id, customer?._id] }` and populate restaurant details.
- In `EditUserProfile`, set `fullname` (and `fullName`) and update fields properly.

#### [MODIFY] [order.controller.js](file:///d:/project/Cravings/server/src/controllers/order.controller.js) & [payment.controller.js](file:///d:/project/Cravings/server/src/controllers/payment.controller.js)
- In `CreateOrder`, allow `currentUser.userType === "user"` or `"customer"`.
- In `payment.controller.js`, fix `getCustomerOrder` to match orders by `customerId: { $in: [userId, customer?._id] }`.

#### [MODIFY] [restaurant.controller.js](file:///d:/project/Cravings/server/src/controllers/restaurant.controller.js)
- Fix `RestaurantUpdateLegalInfo` to update `documents.legalName` and `documents.companyType`.
- Ensure all update handlers safely set fields and return populated data.

---

### Frontend

#### [MODIFY] [index.css](file:///d:/project/Cravings/client/src/index.css)
- Implement full design system with CSS custom properties: `--color-primary`, `--color-primary-content`, `--color-secondary`, `--color-secondary-content`, `--color-accent`, `--color-neutral`, `--color-neutral-content`, `--color-base-100`, `--color-base-200`, `--color-base-300`, `--color-base-content`, `--color-error`, `--color-success`, `--color-warning`, `--color-info`.
- Add smooth animations, glassmorphism utilities, and sleek typography tokens.

#### [NEW] [Loader.jsx](file:///d:/project/Cravings/client/src/components/Loader.jsx)
- Create a reusable, polished `Loader` component that displays the loading animation with customizable height, text, and styling.

#### [MODIFY] [App.jsx](file:///d:/project/Cravings/client/src/App.jsx)
- Clean up duplicate commented code.
- Add routes for `/feedback` and `/help-center`.

#### [MODIFY] [Cart.jsx](file:///d:/project/Cravings/client/src/components/Cart.jsx) & [MenuItemCard.jsx](file:///d:/project/Cravings/client/src/components/publicRestaurantDetails/MenuItemCard.jsx)
- Update role checks to allow `role === "user" || role === "customer"`.
- Use the new `Loader` component.

#### [MODIFY] [ContactUs.jsx](file:///d:/project/Cravings/client/src/pages/ContactUs.jsx), [Feedback.jsx](file:///d:/project/Cravings/client/src/pages/Feedback.jsx), [HelpCenter.jsx](file:///d:/project/Cravings/client/src/pages/HelpCenter.jsx)
- Connect `ContactUs.jsx` to `api.post("/public/contact-us", payload)`.
- Connect `Feedback.jsx` to `api.post("/public/feedback", payload)`.
- Fix background image imports and path resolutions for `FeedbackPage.jpeg`, `HelpPage.jpg`, `foodTable.webp`.

#### [MODIFY] [UserDashboard.jsx](file:///d:/project/Cravings/client/src/pages/dashboard/UserDashboard.jsx), [RestaurantDashboard.jsx](file:///d:/project/Cravings/client/src/pages/dashboard/RestaurantDashboard.jsx), [RiderDashboard.jsx](file:///d:/project/Cravings/client/src/pages/dashboard/RiderDashboard.jsx), [AdminDashboard.jsx](file:///d:/project/Cravings/client/src/pages/dashboard/AdminDashboard.jsx)
- Fix role authorization check in `UserDashboard.jsx` (`user.userType === "user" || user.userType === "customer"`).
- Remove commented duplicate code and polish layout, responsive behavior, and empty states.

#### [MODIFY] [PresonalInformation.jsx](file:///d:/project/Cravings/client/src/components/restaurantDashboard/settings/restaurantInformation/PresonalInformation.jsx)
- Update API call from dead `/restaurant/update-profile` to `/common/edit-profile`.

#### [MODIFY] [RestaurantSetting.jsx](file:///d:/project/Cravings/client/src/components/restaurantDashboard/RestaurantSetting.jsx), [RestaurantDetailsPage.jsx](file:///d:/project/Cravings/client/src/pages/RestaurantDetailsPage.jsx), [Order.jsx](file:///d:/project/Cravings/client/src/components/userDashboard/Order.jsx)
- Replace `<Loader height="..." width="..." />` with the new `Loader` component.

---

## Verification Plan

### Automated Tests & Builds
1. **Frontend Build**: Run `npm run build` in `client` to ensure zero compilation or asset resolution errors.
2. **Backend Startup & Tests**: Run node script to verify MongoDB connection, models loading, routes mapping, and controller integrity.

### Manual / End-to-End Verification
1. **Auth Flow**: Register as `user`, `restaurant`, `rider`; login with credentials; check session persistence on page refresh; verify logout clears session and redirects.
2. **Role Dashboards**: Verify `user` accesses `UserDashboard` (no "Access Denied"), `restaurant` accesses `RestaurantDashboard`, `rider` accesses `RiderDashboard`, `admin` accesses `AdminDashboard`.
3. **Public Features**:
   - Test `GET /public/restaurants` in Home and OrderNow pages.
   - Test `GET /public/restaurant-detail/:restaurantId` in RestaurantDetailsPage.
   - Test `POST /public/contact-us` and `POST /public/feedback`.
4. **Restaurant Features**: Test updating basic info, address, banking documents, cover image, and menu items (add, edit, status toggle, delete).
5. **Customer Features**: Test adding/editing/deleting addresses in AddressBook; adding items to Cart; placing orders and viewing orders in UserDashboard.
6. **UI/UX & Responsive Design**: Verify pages at mobile and desktop breakpoints with consistent design tokens, buttons, inputs, and modals.
