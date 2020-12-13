FROM gitpod/workspace-full

RUN sudo apt-get update

# Install Cypress-base dependencies
RUN sudo apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install -yq \
    libgbm-dev \
    libnotify-dev
RUN sudo apt-get install -y \
    libgconf-2-4 \
    libnss3 \
    libxss1
RUN sudo apt-get install -y \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb

# Install Cypress-browser dependencies
RUN sudo apt-get install -y \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils

ENV CHROME_VERSION 81.0.4044.113
RUN sudo wget -O /usr/src/google-chrome-stable_current_amd64.deb "http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}-1_amd64.deb"

RUN sudo dpkg -i /usr/src/google-chrome-stable_current_amd64.deb
RUN sudo apt-get install -f -y && \
    sudo rm -f /usr/src/google-chrome-stable_current_amd64.deb
RUN google-chrome --version
RUN sudo apt-get install mplayer -y
# ARG FIREFOX_VERSION=75.0
# RUN sudo wget --no-verbose -O /tmp/firefox.tar.bz2 https://download-installer.cdn.mozilla.net/pub/firefox/releases/$FIREFOX_VERSION/linux-x86_64/en-US/firefox-$FIREFOX_VERSION.tar.bz2
# RUN sudo tar -C /opt -xjf /tmp/firefox.tar.bz2 \
#     && sudo rm /tmp/firefox.tar.bz2 \
#     && sudo ln -fs /opt/firefox/firefox /usr/bin/firefox
# RUN echo  " node version:    $(node -v) \n" \
#     "npm version:     $(npm -v) \n" \
#     "yarn version:    $(yarn -v) \n" \
#     "debian version:  $(cat /etc/debian_version) \n" \
#     "Chrome version:  $(google-chrome --version) \n" \
#     "Firefox version: $(firefox --version) \n" \
#     "git version:     $(git --version) \n" \
#     "whoami:          $(whoami) \n"

RUN npm install -g sails
