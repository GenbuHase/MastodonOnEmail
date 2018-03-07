# Mastodon on Email(MoE)
A tool for enjoying Mastodon on Email


## Description
MoE helps you toot with only e-mail.<br />
It is espicially useful for users who don't have any smartphones.


## Features
* Adds instances to use
* Adjusts status privacy
* Uses some features such as CW in body
* Handles your account


## Requirement
* [Google Apps Script](https://www.google.com/script/start/)


## Usage
Please follow the instructions if you want to use.
1.	Copy all files to your GAS project
2.	Launch `scheduleInit()`
3.	Make me busy by sending e-mails!


## Format List
A base format of MoE is `MoE@{:instanceUrl}`.
> `instanceUrl` ... An instance you've connected with MoE

These are examples of format-list.
> `MoE:Toot` ... Equals to `MoE:Toot@{:instanceUrl}`
> 
> `<1>` ... Equals to `MoE@{:instanceUrl}<1>`
> 
> `MoE:Toot<1>` ... Equals to `MoE:Toot@{:instanceUrl}<1>`

| Format of subject | Description |
|:----------|:----------|
| Base Format | Toots a body of the mail |
| <`{:privacy}`> | Toots with selected privacy |
|| `0` ... Public |
|| `1` ... Unlisted |
|| `2` ... Private |
|| `3` ... Direct Message |
| MoE:Toot | Equals to `Base Format` |
| MoE:Toot<`{:privacy}`> | Equals to `<{:privacy}>` |
| MoE:Notify | Requests to MoE to send notifies |


## Author
[GenbuHase](https://github.com/GenbuHase)


## License
[MIT License](https://github.com/GenbuHase/MastodonOnEmail/blob/master/LICENSE)