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
