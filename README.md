expecting upload file to have "root" as the root tag:
\<root\>
    \<row\>
        ...

for local client (windows):
set NODE_OPTIONS=--openssl-legacy-provider

for local server:
change mongo address to localhost

fixing docker:
wsl --shutdown

performance:
for 500 records w unique entities/accounts
staging: 492.176ms
entity creation: 24:27.892 (m:ss.mmm)
payment creation: 1:03.927 (m:ss.mmm)
update payments from method: 1:03.818 (m:ss.mmm)