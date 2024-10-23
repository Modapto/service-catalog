(function ($, OliveUI, OliveUtils) {
  'use strict';

  /*
  This module must visualize the grid for this json:
  {
    gridArray: [{
     imgUrl: ''
     title: '',
     excepit: '',
     color: ''
    }]
  }
  the keys in every gridArray object can vary and this module must be able to adapt to their content
  */

  /*Flip Samples from https://goodstuffmusicalbum.netlify.app */
  var moduleName = 'newProjectsOverviewUI';
  var moduleCSS = function (me) { return `
${me} .flip-card {
  perspective: 1000px;
}

${me} .flip-card-inner {
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

${me} .flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

${me} .flip-card-inner.is-flipped {
  transform: rotateY(180deg);
}

${me} .flip-card-front, .flip-card-back {
  backface-visibility: hidden;
}

${me} .flip-card-front {
  transform: rotateX(0deg);
}

${me} .flip-card-back {
  transform: rotateY(180deg);
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

${me} .box {
  text-align: center;
  background-color: #e84444;
  color: white;
  font-size: 14px;
  height: 100%;
}

${me} .box .flip-card-front {
  height: 100%;
}

${me} .box .flip-card-front .footer {
  background-color: #ffffffb0;
  color: #343a40;
  height: 100%;
  padding-top: 1px;
}

${me} .box .flip-card-back .footer {
  background-color: #00000069;
}

${me} .box p {
  margin: 10px;
  color: white;
  overflow-wrap: anywhere;
}

${me} .box .logo {
  height: 200px;
  text-align: center;
  padding: 10px;
}

${me} .box .logo-sm {
  height: 135px;
  text-align: center;
}

${me} .box .logo img {
  max-width: 100%;
  max-height: 100%;
}

${me} .box .logo .img-full {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: auto;
}

${me} .box svg {
  max-width: 60%;
}

${me} .flip-card-back {
  height: inherit;
  overflow: auto;
}

${me} .title-lg {
  font-size: 30px;
}

${me} .sticky-container {
  display: flex;
  flex-direction: column;
}

${me} .sticky-content {
  flex: 1 0 auto;
}

${me} .sticky-footer {
  flex-shrink: 0;
  padding-bottom: 10px;
}

${me} .link {
  cursor: pointer;
}

${me} .box h3,h4 {
  margin-left: 10px;
  margin-right: 10px;
  overflow-wrap: anywhere;
}


${me} .custom-scrollbar::-webkit-scrollbar-track {
  background-color: #ffffffb0;
}
${me} .custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}
${me} .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #00000069;
}
`; };

  var bookOpenSvg1 = '<svg style="max-width: 40%;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 380 380" style="enable-background:new 0 0 380 380;" xml:space="preserve"><path style="fill: white;" d="M377.071,101.569C351.143,75.64,316.668,61.36,280,61.36c-33.428,0-65.031,11.867-90,33.608c-24.969-21.741-56.572-33.608-90-33.608c-36.668,0-71.143,14.28-97.071,40.208C1.054,103.444,0,105.987,0,108.639v200c0,4.044,2.437,7.691,6.173,9.239c3.737,1.549,8.038,0.692,10.898-2.167C39.223,293.559,68.674,281.36,100,281.36s60.777,12.199,82.929,34.351c0.032,0.032,0.068,0.059,0.1,0.091c0.203,0.198,0.411,0.39,0.63,0.57c0.125,0.103,0.257,0.193,0.386,0.289c0.133,0.099,0.262,0.202,0.4,0.294c0.149,0.099,0.303,0.186,0.455,0.277c0.128,0.076,0.252,0.156,0.384,0.227c0.154,0.083,0.313,0.153,0.47,0.226c0.139,0.065,0.275,0.134,0.417,0.193c0.153,0.063,0.31,0.115,0.466,0.17c0.152,0.054,0.302,0.113,0.458,0.16c0.158,0.048,0.318,0.083,0.477,0.123c0.157,0.039,0.312,0.083,0.472,0.115c0.186,0.037,0.374,0.059,0.561,0.086c0.136,0.019,0.269,0.045,0.406,0.059c0.658,0.065,1.32,0.065,1.978,0c0.137-0.013,0.271-0.04,0.406-0.059c0.188-0.026,0.375-0.049,0.561-0.086c0.16-0.032,0.315-0.076,0.472-0.115c0.159-0.04,0.319-0.075,0.477-0.123c0.156-0.047,0.306-0.106,0.458-0.16c0.156-0.056,0.312-0.107,0.466-0.17c0.142-0.059,0.278-0.128,0.417-0.193c0.157-0.074,0.316-0.144,0.47-0.226c0.131-0.07,0.256-0.151,0.384-0.227c0.153-0.091,0.307-0.177,0.455-0.277c0.138-0.092,0.267-0.195,0.4-0.294c0.129-0.096,0.261-0.186,0.386-0.289c0.219-0.18,0.427-0.372,0.63-0.57c0.033-0.032,0.068-0.058,0.1-0.091c22.151-22.151,51.603-34.351,82.929-34.351s60.777,12.199,82.929,34.351c1.913,1.913,4.471,2.929,7.073,2.929c1.288,0,2.588-0.25,3.825-0.762c3.736-1.548,6.173-5.194,6.173-9.239v-200C380,105.987,378.946,103.444,377.071,101.569zM20,287.04V112.879C41.786,92.522,70.035,81.36,100,81.36c29.967,0,58.213,11.171,80,31.531v174.154c-23.166-16.682-50.89-25.685-80-25.685C70.892,261.36,43.166,270.359,20,287.04zM360,287.04c-23.166-16.681-50.892-25.68-80-25.68c-29.11,0-56.834,9.002-80,25.685V112.891c21.787-20.36,50.033-31.531,80-31.531c29.965,0,58.214,11.162,80,31.519V287.04z"/></svg>';

  var bookOpenSvg = '<svg style="margin-top:10px; max-width: 50%; enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M512,256.204C512,114.571,397.436,0,255.802,0   C114.571,0,0,114.571,0,256.204C0,397.429,114.571,512,255.802,512C397.436,512,512,397.429,512,256.204L512,256.204z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#324A5E;"/><rect height="333.379" style="fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;" width="249.041" x="126.906" y="89.51"/><rect height="24.669" style="fill-rule:evenodd;clip-rule:evenodd;fill:#324A5E;" width="13.129" x="146" y="121.335"/><rect height="13.131" style="fill-rule:evenodd;clip-rule:evenodd;fill:#E6E9EE;" width="36.999" x="115.366" y="126.905"/><rect height="25.059" style="fill-rule:evenodd;clip-rule:evenodd;fill:#324A5E;" width="13.129" x="146" y="182.208"/><rect height="12.732" style="fill-rule:evenodd;clip-rule:evenodd;fill:#E6E9EE;" width="36.999" x="115.366" y="188.566"/><rect height="24.665" style="fill-rule:evenodd;clip-rule:evenodd;fill:#324A5E;" width="13.129" x="146" y="243.868"/><rect height="12.726" style="fill-rule:evenodd;clip-rule:evenodd;fill:#E6E9EE;" width="36.999" x="115.366" y="249.837"/><rect height="24.671" style="fill-rule:evenodd;clip-rule:evenodd;fill:#324A5E;" width="13.129" x="146" y="305.127"/><rect height="13.129" style="fill-rule:evenodd;clip-rule:evenodd;fill:#E6E9EE;" width="36.999" x="115.366" y="310.703"/><rect height="25.066" style="fill-rule:evenodd;clip-rule:evenodd;fill:#324A5E;" width="13.129" x="146" y="365.998"/><rect height="12.73" style="fill-rule:evenodd;clip-rule:evenodd;fill:#E6E9EE;" width="36.999" x="115.366" y="372.363"/><rect height="58.878" style="fill-rule:evenodd;clip-rule:evenodd;fill:#90DFAA;" width="20.678" x="375.947" y="178.623"/><rect height="58.878" style="fill-rule:evenodd;clip-rule:evenodd;fill:#FF7058;" width="20.678" x="375.947" y="243.47"/><rect height="58.879" style="fill-rule:evenodd;clip-rule:evenodd;fill:#54C0EB;" width="20.678" x="375.947" y="113.379"/></g></svg>';
  var bookClosedSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="200px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M512,255.999C512,114.483,397.427,0,255.811,0   C114.577,0,0,114.483,0,255.999C0,397.118,114.577,512,255.811,512C397.427,512,512,397.118,512,255.999L512,255.999z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#88C5CC;"/><path d="M162.709,118.858h193.736l44.16,193.987h-16.308l-0.399,68.771   h16.707v11.528H138.449c-25.064-1.989-22.68-46.107-23.872-58.038l21.887-197.172C136.464,129.192,145.604,118.858,162.709,118.858   L162.709,118.858z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#FFD05B;"/><path d="M162.709,118.858h18.313L164.3,393.146h-25.851   c-30.628-3.583-31.422-51.679-21.886-77.916l19.9-177.294C136.464,129.192,145.604,118.858,162.709,118.858L162.709,118.858z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#324A5E;"/><path d="M141.632,312.846H395.44   c-11.542,23.453-11.143,46.904,0,69.564H141.632C114.577,382.41,114.577,312.846,141.632,312.846L141.632,312.846z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#FEFEFE;"/><path d="M125.321,325.969h264.951   c-0.398,0.789-0.398,1.587-0.794,2.383H124.527C124.926,327.556,124.926,326.758,125.321,325.969L125.321,325.969z    M388.286,333.521c0,0.793,0,1.191-0.398,1.984H122.542c0-0.793,0.395-1.191,0.395-1.984H388.286z M387.489,340.678   c-0.396,0.789-0.396,1.586-0.396,1.98H121.35c0.395-0.395,0.395-1.191,0.395-1.98H387.489z M387.094,348.229   c0,0.395,0,1.191,0,1.985H121.35c0-0.794,0-1.591,0-1.985H387.094z M387.489,355.383c0,0.793,0,1.59,0,1.984H122.143   c0-0.395-0.398-1.191-0.398-1.984H387.489z M388.682,362.536c0,0.797,0.398,1.595,0.398,2.383H123.734   c-0.399-0.788-0.399-1.586-0.399-2.383H388.682z M390.671,370.092c0,0.793,0.396,1.191,0.396,1.984H127.312   c-0.399-0.394-0.798-0.793-1.192-1.191c-0.399-0.395-0.399-0.793-0.399-0.793H390.671z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#ECF0F1;"/></g></svg>';


  var microserviceFront = '<svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="M512,256.204C512,114.571,397.436,0,255.802,0   C114.571,0,0,114.571,0,256.204C0,397.429,114.571,512,255.802,512C397.436,512,512,397.429,512,256.204L512,256.204z" style="fill-rule: evenodd; clip-rule: evenodd; fill: rgb(50, 74, 94);"/><path d="M 278.43 240.632 L 199.455 306.051 L 206.212 314.077 L 300.641 235.165 L 206.212 156.694 L 199.445 164.71 L 278.44 230.14 L 48.828 230.14 L 48.828 240.632 L 278.43 240.632 Z" style="fill: rgb(239, 56, 56);" transform="matrix(0, -1, 1, 0, -60.651005, 410.119991)"/><path d="M 429.205 265.664 L 350.23 200.245 L 356.987 192.219 L 451.416 271.131 L 356.987 349.602 L 350.22 341.586 L 429.215 276.156 L 199.603 276.156 L 199.603 265.664 L 429.205 265.664 Z" style="paint-order: stroke; fill: rgb(161, 226, 77);" transform="matrix(0, 1, -1, 0, 596.419983, -54.598999)"/></g></svg>';
  var microserviceBack = '<svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="M512,256.204C512,114.571,397.436,0,255.802,0   C114.571,0,0,114.571,0,256.204C0,397.429,114.571,512,255.802,512C397.436,512,512,397.429,512,256.204L512,256.204z" style="fill-rule: evenodd; clip-rule: evenodd; fill: rgb(246, 216, 157);"/></g><g transform="matrix(0.976973, 0, 0, 0.976973, 10.042697, 6.44065)" style=""><g id="File_Sharing_2_" transform="matrix(1, 0, 0, 1, 4.095095, -4.664838)"><path id="Cable" class="st1" d="M161.8,263.5c-1.6,0-2.8-1.2-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8h96.1c1.6,0,2.8,1.3,2.8,2.8v19.5h33.6 v-87.8c0-1.6,1.3-2.8,2.8-2.8c1.6,0,2.8,1.3,2.8,2.8V283c0,1.6-1.2,2.8-2.8,2.8h-36.4v50.6H335c1.6,0,2.8,1.3,2.8,2.8 c0,1.6-1.3,2.8-2.8,2.8h-77.1c-1.6,0-2.8-1.2-2.8-2.8V283v-19.5H161.8z" style="fill: rgb(230, 230, 230);"/><g id="Folders"><g><path class="st2" d="M104.5,227.5v-6.1H75.5v6.1H67c-2.5,0-4.5,2-4.5,4.5v45.3c0,2.5,2,4.5,4.5,4.5h74.2c2.5,0,4.5-2,4.5-4.5V232 c0-2.5-2-4.5-4.5-4.5H104.5z" style="clip-rule: evenodd; fill: rgb(212, 150, 0); fill-rule: evenodd;"/><path class="st3" d="M85.5,235.9h79.9c1.9,0,3,1.6,2.5,3.4l-12.2,43c-0.5,1.9-2.5,3.4-4.4,3.4H71.4c-1.9,0-3-1.6-2.5-3.4l12.2-43 C81.6,237.4,83.6,235.9,85.5,235.9L85.5,235.9z" style="clip-rule: evenodd; fill: rgb(255, 207, 0); fill-rule: evenodd;"/><path class="st4" d="M63.7,294h91c2,0,3.7,1.6,3.7,3.7l0,0c0,2-1.7,3.7-3.7,3.7h-91c-2,0-3.7-1.7-3.7-3.7l0,0 C60,295.6,61.7,294,63.7,294L63.7,294z" style="clip-rule: evenodd; fill: rgb(41, 210, 177); fill-rule: evenodd;"/><path class="st5" d="M158.4,297.5c0,0.1,0,0.1,0,0.2l0,0c0,2-1.7,3.7-3.7,3.7h-91c-2,0-3.7-1.7-3.7-3.7l0,0c0-0.1,0-0.1,0-0.2 H158.4z" style="clip-rule: evenodd; fill: rgb(30, 153, 129); fill-rule: evenodd;"/><rect x="106.9" y="285.8" class="st4" width="4.6" height="8.2" style="clip-rule: evenodd; fill: rgb(41, 210, 177); fill-rule: evenodd;"/></g><g><path class="st2" d="M264.6,118.5v-6.1h-29v6.1h-8.5c-2.5,0-4.5,2-4.5,4.5v45.3c0,2.5,2,4.5,4.5,4.5h74.1c2.5,0,4.5-2,4.5-4.5 V123c0-2.5-2-4.5-4.5-4.5H264.6z" style="clip-rule: evenodd; fill: rgb(212, 150, 0); fill-rule: evenodd;"/><path class="st3" d="M245.6,126.8h79.9c1.9,0,3,1.6,2.5,3.4l-12.2,43c-0.5,1.9-2.5,3.4-4.4,3.4h-79.9c-1.9,0-3-1.6-2.5-3.4 l12.2-43C241.7,128.4,243.7,126.8,245.6,126.8L245.6,126.8z" style="clip-rule: evenodd; fill: rgb(255, 207, 0); fill-rule: evenodd;"/><path class="st4" d="M223.8,184.9h91c2,0,3.7,1.7,3.7,3.7l0,0c0,2-1.7,3.7-3.7,3.7h-91c-2,0-3.7-1.7-3.7-3.7l0,0 C220.1,186.6,221.7,184.9,223.8,184.9L223.8,184.9z" style="clip-rule: evenodd; fill: rgb(41, 210, 177); fill-rule: evenodd;"/><path class="st5" d="M318.5,188.4c0,0.1,0,0.1,0,0.2l0,0c0,2-1.7,3.7-3.7,3.7h-91c-2,0-3.7-1.7-3.7-3.7l0,0c0-0.1,0-0.1,0-0.2 H318.5z" style="clip-rule: evenodd; fill: rgb(30, 153, 129); fill-rule: evenodd;"/><rect x="267" y="176.7" class="st4" width="4.6" height="8.1" style="clip-rule: evenodd; fill: rgb(41, 210, 177); fill-rule: evenodd;"/></g><g><path class="st2" d="M377,313.9v-6.1H348v6.1h-8.4c-2.5,0-4.5,2-4.5,4.5v45.3c0,2.5,2,4.5,4.5,4.5h74.1c2.5,0,4.5-2,4.5-4.5 v-45.3c0-2.5-2-4.5-4.5-4.5H377z" style="clip-rule: evenodd; fill: rgb(212, 150, 0); fill-rule: evenodd;"/><path class="st6" d="M359.5,291.7h41.9l5.2,5.2l5.6,5.6v55.5c0,0.8-0.7,1.5-1.6,1.5h-51c-0.8,0-1.6-0.7-1.6-1.5v-64.7 C358,292.4,358.7,291.7,359.5,291.7L359.5,291.7z" style="clip-rule: evenodd; fill: rgb(249, 249, 249); fill-rule: evenodd;"/><path class="st7" d="M412.1,302.4h-9.2c-0.8,0-1.5-0.7-1.5-1.6v-9.2l5.5,5.5L412.1,302.4z" style="clip-rule: evenodd; fill: rgb(204, 204, 204); fill-rule: evenodd;"/><path class="st3" d="M358.5,312.1h77.8c1.9,0,3,1.5,2.4,3.4l-11.9,41.9c-0.5,1.9-2.5,3.4-4.3,3.4h-77.9c-1.8,0-2.9-1.5-2.4-3.4 l11.9-41.9C354.7,313.6,356.6,312.1,358.5,312.1L358.5,312.1z" style="clip-rule: evenodd; fill: rgb(255, 207, 0); fill-rule: evenodd;"/><path class="st4" d="M336.2,380.3h91c2,0,3.7,1.7,3.7,3.7l0,0c0,2-1.7,3.7-3.7,3.7h-91c-2,0-3.7-1.6-3.7-3.7l0,0 C332.5,382,334.2,380.3,336.2,380.3L336.2,380.3z" style="clip-rule: evenodd; fill: rgb(41, 210, 177); fill-rule: evenodd;"/><path class="st5" d="M430.9,383.9c0,0.1,0,0.1,0,0.2l0,0c0,2-1.7,3.7-3.7,3.7h-91c-2,0-3.7-1.6-3.7-3.7l0,0c0-0.1,0-0.1,0-0.2 H430.9z" style="clip-rule: evenodd; fill: rgb(30, 153, 129); fill-rule: evenodd;"/><rect x="379.4" y="372.2" class="st4" width="4.6" height="8.1" style="clip-rule: evenodd; fill: rgb(41, 210, 177); fill-rule: evenodd;"/></g></g><path id="Cloud" class="st8" d="M255.8,243.9c7.1,0,12.9,5.8,12.9,12.9c0,0.9-0.1,1.8-0.3,2.7c8.2,0,14.8,6.6,14.8,14.8 c0,6.6-4.4,12.3-10.4,14.2h-53.2c-4.6-2.5-7.7-6.7-7.7-11.5c0-7.2,6.9-13.1,15.6-13.7c0.1-6.1,5.1-11,11.2-11c1.7,0,3.3,0.4,4.7,1 C245,247.8,249.9,243.9,255.8,243.9L255.8,243.9z" style="clip-rule: evenodd; fill: rgb(255, 255, 255); fill-rule: evenodd;"/><g id="Wifi"><path class="st4" d="M155.9,214.1c21,0,38.2-17.2,38.2-38.2c0-21-17.2-38.2-38.2-38.2c-21.1,0-38.2,17.2-38.2,38.2 C117.7,196.9,134.9,214.1,155.9,214.1L155.9,214.1z" style="clip-rule: evenodd; fill: rgb(41, 210, 177); fill-rule: evenodd;"/><path class="st9" d="M155.9,137.6c21.1,0,38.2,17.1,38.2,38.2c0,21.1-17.1,38.2-38.2,38.2V137.6z" style="clip-rule: evenodd; fill: rgb(81, 219, 192); fill-rule: evenodd;"/><path class="st10" d="M127.1,169.8c3.7-3.9,8.2-7,13.1-9.1v0c4.9-2.1,10.2-3.2,15.7-3.2c5.5,0,10.8,1.1,15.7,3.2 c4.9,2.1,9.4,5.2,13.2,9.2l-2.6,2.5c-3.4-3.6-7.5-6.5-12-8.4c-4.5-1.9-9.3-2.9-14.3-2.9c-4.9,0-9.8,1-14.2,2.9l0,0 c-4.5,1.9-8.5,4.7-12,8.3L127.1,169.8z M151.1,189.9c0.6-0.7,1.4-1.2,2.2-1.5l0,0c0.8-0.4,1.7-0.6,2.6-0.6c0.9,0,1.8,0.2,2.7,0.6 c0.8,0.3,1.6,0.9,2.2,1.6c-0.8,0.8-4,4.3-4.8,4.3C155,194.2,151.9,190.7,151.1,189.9L151.1,189.9z M143,182.9 c1.7-1.8,3.7-3.2,5.9-4.1c2.2-1,4.6-1.5,7-1.5c2.5,0,4.8,0.5,7,1.5c2.2,1,4.2,2.4,5.9,4.1l-2.6,2.5c-1.3-1.4-2.9-2.5-4.7-3.3 c-1.7-0.7-3.7-1.1-5.6-1.1c-2,0-3.9,0.4-5.6,1.1c-1.8,0.7-3.4,1.9-4.7,3.3L143,182.9z M135.1,176.3c2.7-2.9,6-5.1,9.5-6.6l0,0 c3.5-1.5,7.4-2.3,11.3-2.3c3.9,0,7.8,0.8,11.4,2.4c3.5,1.5,6.8,3.8,9.5,6.6l-2.6,2.5c-2.4-2.5-5.2-4.5-8.3-5.8 c-3.1-1.4-6.5-2.1-9.9-2.1c-3.5,0-6.8,0.7-9.9,2l0,0c-3.1,1.3-5.9,3.3-8.3,5.8L135.1,176.3z" style="fill: rgb(255, 255, 255);"/></g><g id="Share"><path class="st11" d="M357.5,273.2c21.1,0,38.2-17.2,38.2-38.2c0-21-17.2-38.2-38.2-38.2c-21,0-38.2,17.2-38.2,38.2 C319.2,256,336.4,273.2,357.5,273.2L357.5,273.2z" style="clip-rule: evenodd; fill: rgb(3, 56, 110); fill-rule: evenodd;"/><path class="st12" d="M357.5,196.8c21.1,0,38.2,17.1,38.2,38.2c0,21.1-17.1,38.2-38.2,38.2V196.8z" style="clip-rule: evenodd; fill: rgb(51, 94, 138); fill-rule: evenodd;"/><path class="st8" d="M368.8,212.3c3.3,0,5.9,2.6,5.9,5.9c0,3.3-2.6,5.9-5.9,5.9c-1.5,0-2.9-0.6-3.9-1.5l-19.8,11.3 c0.1,0.3,0.1,0.7,0.1,1.1c0,0.4,0,0.8-0.1,1.1l19.8,11.3c1.1-0.9,2.4-1.5,3.9-1.5c3.3,0,5.9,2.6,5.9,5.9c0,3.3-2.6,5.9-5.9,5.9 s-5.9-2.6-5.9-5.9c0-0.4,0-0.7,0.1-1.1l-19.8-11.3c-1.1,0.9-2.4,1.5-3.9,1.5c-3.3,0-5.9-2.6-5.9-5.9c0-3.3,2.6-5.9,5.9-5.9 c1.5,0,2.9,0.6,3.9,1.5l19.8-11.3c-0.1-0.3-0.1-0.7-0.1-1.1C363,214.9,365.6,212.3,368.8,212.3L368.8,212.3z" style="clip-rule: evenodd; fill: rgb(255, 255, 255); fill-rule: evenodd;"/></g><g id="Download_Upload"><path class="st13" d="M200,396.7c21.1,0,38.2-17.2,38.2-38.2c0-21.1-17.2-38.2-38.2-38.2c-21,0-38.2,17.2-38.2,38.2 C161.8,379.5,178.9,396.7,200,396.7L200,396.7z" style="clip-rule: evenodd; fill: rgb(206, 71, 75); fill-rule: evenodd;"/><path class="st14" d="M200,320.2c21.1,0,38.2,17.1,38.2,38.2c0,21.1-17.1,38.2-38.2,38.2V320.2z" style="clip-rule: evenodd; fill: rgb(215, 106, 109); fill-rule: evenodd;"/><path class="st8" d="M187.9,369.1h10.4V347h4.2l-4.7-8.1l-4.7-8.1l-4.7,8.1l-4.7,8.1h4.1V369.1z M203.1,351.8h9.4v20.1h3.8 l-4.3,7.4l-4.3,7.4l-4.3-7.4l-4.3-7.4h3.8V351.8z" style="clip-rule: evenodd; fill: rgb(255, 255, 255); fill-rule: evenodd;"/></g></g></g></svg>';
  
  var _statics = {
    setContent: function (_sub, config, content) {
      content.gridArray = content.gridArray || [];
      _sub.grid.setContent({});
      content.gridArray.forEach(function (gridItemJson, index) {
        _sub.grid.addDomEl(null, _statics.createGridItem(config, gridItemJson));
      });
    },
    createGridItem: function (config, gridItemJson) {
      return $('<div class="flip-card">').append(
        $('<div class="flip-card-inner box" ' + (gridItemJson.color ? 'style="background-color: ' + gridItemJson.color + ';"' : '') + '>').append(
          $('<div class="flip-card-front">').append(
            $('<div class="logo">').append(
              gridItemJson.imgUrl ? '<img class="" src="' + gridItemJson.imgUrl + '"/>' : bookClosedSVG
            ),
            $('<div class="footer">').append(
              '<h3>' + (gridItemJson.title?gridItemJson.title:'No Title') + '</h3>',
              '<br>'
            )
          ),
          $('<div class="flip-card-back link sticky-container custom-scrollbar">').append(
            $('<div class="logo-sm sticky-content">').append(
              bookOpenSvg
            ),
            $('<div class="sticky-content">').append(
              gridItemJson.excepit ? '<p>' + gridItemJson.excepit + '</p>' : ''
            ),
            '<br>',
            '<b class="title-lg sticky-footer footer">Look inside!</b>'
          ).click(function (e) {
            e.stopPropagation();
            config.onItemClickFn(gridItemJson);
          })
        )
      );
    }
  };

  OliveUI.modules[moduleName] = function (config = {}) {
    if (!OliveUI.modules.newLayout_grid) throw 'Missing newLayout_grid module';
    config.onItemClickFn = config.onItemClickFn || function (gridItemJson) {};
    config.itemCreationUI = config.itemCreationUI || null;
    config.onItemCreatedFn = config.onItemCreatedFn || function (itemJson) {};
    config.numColumns = config.numColumns || 4;

    var moduleCSSClass = OliveUtils.setCSSNoLess(moduleName, moduleCSS);

    var _dom = {
      rootDiv: $('<div class="' + moduleCSSClass + '">')
    };

    var _sub = {
      grid: OliveUI.modules.newLayout_grid({
        numColumns: config.numColumns
      })
    };

    return {
      render: function () {
        return _dom.rootDiv.append(
          _sub.grid.render()
        );
      },
      setContent: function (content = {}) {
        _statics.setContent(_sub, config, content);
      }
    };
  };

}($, OliveUI, OliveUtils));
