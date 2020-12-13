FROM cypress/base
# FROM gitpod/workspace-full

# RUN sudo apt-get update

# # Install Cypress-base dependencies
# RUN sudo apt-get install -y \
#     libgtk2.0-0 \
#     libgtk-3-0
# RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install -yq \
#     libgbm-dev \
#     libnotify-dev
# RUN sudo apt-get install -y \
#     libgconf-2-4 \
#     libnss3 \
#     libxss1
# RUN sudo apt-get install -y \
#     libasound2 \
#     libxtst6 \
#     xauth \
#     xvfb

# # Install Cypress-browser dependencies
# RUN sudo apt-get install -y \
#     fonts-liberation \
#     libappindicator3-1 \
#     xdg-utils

# ENV CHROME_VERSION 81.0.4044.113
# RUN sudo wget -O /usr/src/google-chrome-stable_current_amd64.deb "http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}-1_amd64.deb"

# RUN sudo dpkg -i /usr/src/google-chrome-stable_current_amd64.deb
# RUN sudo apt-get install -f -y && \
#     sudo rm -f /usr/src/google-chrome-stable_current_amd64.deb
# RUN google-chrome --version
# RUN sudo apt-get install mplayer -y

RUN npm install -g sails
