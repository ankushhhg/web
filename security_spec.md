# Security Specification - Shree Ganesh Marble & Granite

## Data Invariants
1. A **User** document must have a `role` of either 'user' or 'admin'.
2. Users can only edit their own profile.
3. Only Admins can modify the `role` field.
4. **Products** are readable by everyone.
5. Only Admins can create/update/delete Products.
6. **Orders** must belong to a valid `userId`.
7. Once an order is 'delivered' or 'rejected', its status can only be modified by an Admin.
8. Users can only read their own Orders.
9. Users can create Orders, but only for themselves (`userId` matches `auth.uid`).

## The Dirty Dozen Payloads (Targeting Rejection)
1. **Identity Spoofing**: User A trying to create an order for User B.
2. **Privilege Escalation**: User trying to update their own role to 'admin'.
3. **Ghost Field Injection**: Adding a `wholesaleAccess: true` field to a Product.
4. **Price Manipulation**: User trying to update a Product's price.
5. **ID Poisoning**: Creating a product with a 2KB string as ID.
6. **Status Skip**: User trying to mark their own order as 'approved'.
7. **Orphaned Order**: Creating an order with a non-existent `userId`.
8. **Invalid Color**: Setting product color to a boolean.
9. **Denial of Wallet**: Creating a user with a 1MB name string.
10. **Time Machine**: Setting `createdAt` to a date in 2005.
11. **Negative Stock**: Setting product stock to -50.
12. **Unauthorized Deletion**: User trying to delete a Product.

## Rules Generation Strategy
- Master Gate: Relationship sync for Orders.
- Validation Blueprints for each entity.
- Path Variable hardening.
- Action-Based Update patterns for Order status changes.
