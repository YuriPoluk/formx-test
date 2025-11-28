# [Preview](http://formx-test.s3-website.eu-central-1.amazonaws.com/)

# Running locally
```npm i npm run dev```

## Technical decisions

- I tried to choose different materials, not only the ones that look cool in PBR.
- Even though displacement/height map isn't a part of the PBR workflow I use it only for PBR materials to make the switch more dramatic.  
- In production metallic, roughness and AO maps should have been combined into different channels of a single texture to save on load times and memory.