## How the Application Works

1. **User Registration:**

    - Users must register to access the application.
    - During registration, you can assign a role to the user for convenience.

2. **User Authentication:**

    - After registration, users can log in to receive access and refresh tokens.

3. **Ticket Creation:**

    - Using their access token, users can create a ticket by providing a title (subject).

4. **Opening a Ticket Socket:**

    - Once a ticket is created, users can open a socket connection by providing their access token and the ticket ID.

5. **Employee Interaction:**

    - Employees can view open tickets, select one to respond to, and send messages within the ticket.
    - Once a second message is sent to a ticket, it is marked as "in progress" making it unavailable for other employees.

6. **Closing Tickets:**

    - Employees can close tickets, after which no further messages can be sent.

7. **Admin Overview:**
    - Administrators have access to all tickets and their message histories. (there are filters in route for admin convenience)

---

## Creating a Socket.io Request in Postman

All HTTP requests are exported and included in the project root as `Ticket System HTTP.postman_collection.json`. However, since socket collections cannot be exported, follow these steps to create a socket request manually:

1. **Host:**

    - `http://localhost:4200`

2. **Headers:**

    - Key: `Authorization`
    - Value: `Bearer [TOKEN]`

3. **Events:**

    - `message`
    - `error`

4. **Body:**

    ```json
    {
        "ticketId": "uuid of the ticket",
        "content": "user / employee message"
    }
    ```

5. **Event name:**

    - `sendMessage`
