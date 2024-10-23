# MODAPTO Service Catalog
The project contain for the MODAPTO Service Catalog code

## Requirement
- Orchestrator based on Microservice Controller deployed using [Docker](https://github.com/Modapto/orchestrator)
- GitLab platform with rights to create Groups and Projects.

## Deploy
The project is only composed of HTML pages and client side JS code. In order to deploy simply copy the content of `PUBLIC` folder into a web server public folder (like the `apache2` or `nginx`).

## Test it

The main index page under `./sites/catalogue/`.
When deployed locally it can be reachable at `http://127.0.0.1/sites/catalogue/`.

## Configure
1) Upload in the `Microservice Controller` every microservice configuration JSON file available in the `.\MICROSERVICES\` folder
2) Edit the file `.PUBLIC\sites\catalogue\index.html` adapting the following parameters in the CONFIG variable:
    - mscEndpoint: Add here the public link of the deployed Microservice Controller
    - gitlabUrl: Add here the url of your GitLab portal
    - gitlabGroupId: Add here the id of the GitLab group containing the projects
    - gitlabGroupPage: Add here the public link of the GitLab group containing the projects

## Create GitLab Content
A sample of GitLab content is available at [https://git.boc-group.eu/olive/modapto-smart-services](https://git.boc-group.eu/olive/modapto-smart-services)

1) Create a GitLab group for the services
2) Create a GitLab project each service, containing a README.md file
3) Edit the README.md file adding metadata information on top of it
    - the metadata section must start and end with `---`
    - the minimum required keys are `affiliation`, `keywords`, `menu1`
    - `menu1`, `menu2`, etc. must be a single word and referring to title (identified with the markdown element `#`) in the README.md
    - An example is [here](https://git.boc-group.eu/olive/modapto-smart-services/sample-smart-service-1/-/blob/main/README.md)
    - Optional keys are:
      - `title`: if not provided the GitLab Project name will be used
      - `excepit`: if not provided the GitLab Project description will be used
      - `imgUrl`: if not provided the GitLab Project avatar will be used
4) Give to the service owner the `maintainer` right on the project, to edit the content
5) Services owners can now edit the service decription and avatar in the Project setting
6) Services owners can now add content to the README.md file of the service, in markdown format