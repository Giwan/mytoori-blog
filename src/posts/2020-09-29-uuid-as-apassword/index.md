---
path: "/uuid-as-a-password"
date: "2020-09-29"
title: "Using UUIDs as passwords?"
summary: "What if a user's passwords were a list of UUIDs instead? A list that can be generated in a less traditional means."
image: ""
author: "Giwan Persaud"
published: true
---

Instead of a traditional password input field, NoMergency uses a pincode entry system which shows 0-9 emojis. These are converted into UUIDs that, when pressed, add a UUID to the list that is sent to the backend. Why is this?

I should preface this: **I'm not a security expert**. It's just a silly idea I had while building NoMergency. It's silly because it doubles down on security through obscurity. It tries to make it harder for an attacker to guess.

---

> "Let's make it harder for the user to login" - said no one.

That's exactly what passwords are meant to do. And with good reason. Make it too easy and others can also login.

In 2020 there's a mantra around passwords:

-   Don't use the same passwords on different sites
-   Should have more than six characters
-   Use special characters
-   etc.

NoMergency _has_ to avoid that. It's usecase is for when users are in a light panic and need access to their contacts from a samaritan's device.

NoMergency gives the user a "pincode" screen. The layout looks like the standard 0-9 keypad were it not for the fact that, in NoMergency's case, the numbers are replaced with emojis. That's not core to the security part however. One could do the same with a standard number pad as well.

Press an emoji button, the frontend app adds a UUID to the password list. Choose four emojis and those are stored as four UUIDs. That's effectively the password.

Click `register` and the server receives a list of four UUIDs. These are first mapped to another set of UUIDs, turned into a larger string and salted and encrypted in the database.

## What problems does it solve?

-   The user has to only remember four emojis.
-   The list of UUID ensures that the actual password is much larger.

## Pincode to Emoji mapping

The user sees a emoji grid. That grid maps to a grid of UUIDs. Those should be generated on the server for better security.

1. The server generates a list of nine UUIDs and maps that to it's own internal list of UUIDs. The internal list never leaves the server.

2. The public list of nine UUIDs is mapped to the emoji grid.

3. The user enters their emoji pincode, which effectively selects the four corresponding UUIDs.

4. That list is now sent back to the server where it's corresponding UUID on the server is looked up.

5. Together with the four matching internal UUIDs and the salt string on the server, the password is reconstructed.

## Is this secure?

### An attacker can still brute force the list of emojis.

In the case of NoMergency, there are nine emojis. With a string of four an attacker has 9^4 = 6561 possible combinations.
That's not very many to create a very secure system. However for the NoMergency use case, it's sufficient.

A more secure system would map the computer keyboard to UUIDs and require longer passwords. If the user uses the string "hello" for a password, that results in a list of five UUIDs.
These are sent to the server where validation takes place as described above. For every following login attempt a new list of UUIDs is received from the server.

> Two client devices therefore never generate the same five UUIDs.

The end result is that the actual password leaving the client device and being sent over the network is an intermediate list. When using SSL to secure the conection this might seem redundant. It serves a higher purpose however.

### Brute forcing

Let's say the attacker uses a rainbow table of 4 where one of the entries is "hello". Looping over the rainbow table, requires each word to be reconstructed using a new list of UUIDs for _every_ login request.
Ultimate the password can still be found. It will however require significantly more effort on the part of the attacker.

### Passwords from one comprimised site, pose less of a risk on other sites.

If a user uses the password "hello" on site A. That password is sent over the wire as a list of UUIDs. Ultimately it's stored as a diffrent string.
On site B, the user uses the same password. If site B is comprimised the password that is obtained can't be easily uses to compare with Site A.

When compared to just storing a salted password hash, this setup adds another layer of security.

---

The overall benefit

-   Acquiring a username & password is significantly less interesting for an attacker.
-   While users _should_ follow save password guidelines, it's also a well known fact that most don't. This approach could benefit those users.

Ultimately it depends on what your protecting.
