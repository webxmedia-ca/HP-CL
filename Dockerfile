# got this dockerfile built based on:
#https://github.com/browserstack/browserstack-docker-example/blob/master/Dockerfile
#FROM node:8.12-slim    #https://hub.docker.com/_/node?tab=tags&page=16
FROM node:8.12.0

#change the loglevel (https://docs.npmjs.com/misc/config):
#Default: “notice”  ///  #Values: “silent”, “error”, “warn”, “notice”, “http”, “timing”, “info”, “verbose”, “silly”
#ENV NPM_CONFIG_LOGLEVEL info
#ENV NPM_CONFIG_LOGLEVEL warn

#not sure if needed  - maybe to use later, increase the version
ARG VERSION=1.0.0

# Copy the application files
RUN mkdir -p /HSCLAutomation
WORKDIR /HSCLAutomation
COPY package.json /HSCLAutomation

#RUN ["npm", "install"]
RUN npm install

#the one below - not sure if needed !!!!!!
LABEL license=MIT version=$VERSION authors=ValeriuJecov Description="This image is used to do run the CreateNewListings script for CraigList" Vendor="WebXMedia"

#new stuff --------------------------------------------------------:
#without this stuff, manually runnning the tests won't work (from bash cmd)
#COPY .jshintrc /HSCLAutomation
#COPY browserstack.json /HSCLAutomation
#COPY GruntFile.js /HSCLAutomation
#COPY LICENSE /HSCLAutomation
#COPY README.md /HSCLAutomation

#RUN mkdir -p config; mkdir -p grunt; mkdir -p lib;
#COPY config config/
#COPY grunt grunt/
#COPY lib lib/


##### --------------------- NOT SURE THE ONES BELOW ARE NEEDED --------------------- #####
#the files below - I am not sure if they are needed:
#COPY .gitlab-ci.yml
#COPY .gitignore
#COPY Dockerfile
#COPY .dockerignore
#COPY docker-compose.yml
#COPY HSCLAutomation.iml /HSCLAutomation

#RUN mkdir -p /HSCLAutomation/lib/basic-auth-chrome-proxy
#COPY lib /HSCLAutomation/lib/basic-auth-chrome-proxy
#RUN mkdir -p /HSCLAutomation/lib/basic-auth-chrome-proxy/app-internal-proxy
#COPY lib /HSCLAutomation/lib/basic-auth-chrome-proxy/app-internal-proxy
#RUN mkdir -p /HSCLAutomation/lib/ext
#COPY lib /HSCLAutomation/lib/ext

#RUN mkdir -p /HSCLAutomation/lib/UofC
#COPY lib/UofC /HSCLAutomation/lib/UofC/
#COPY lib/UofC/Grid.js /HSCLAutomation/lib/UofC
#COPY lib/harness.js /HSCLAutomation/lib/
#COPY lib/harness-json.js /HSCLAutomation/lib/
#COPY lib/jira-updater.js /HSCLAutomation/lib/
#COPY lib/Common.js /HSCLAutomation/lib/
#COPY lib/AppRelated-General.js /HSCLAutomation/lib/
#COPY lib/AppRelated-PageObjectModel.js /HSCLAutomation/lib/
#####--------------------------------------------------------------------------------#####


#RUN mkdir -p reporters; mkdir -p screen-caps; mkdir -p tests;
#COPY reporters reporters/
#COPY screen-caps screen-caps/
#COPY tests tests/

#RUN ["npm", "install"]
#RUN npm install

#next line will copy the entire content of the HSCLAutomation folder into the docker image
# ignoring the files & folders specified in the '.dockerignore' file
COPY . /HSCLAutomation