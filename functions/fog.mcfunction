fog @a[tag=desert,tag=!rain,tag=!thunder,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_desert desert
fog @a[tag=mesa,tag=!rain,tag=!thunder,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_mesa mesa
fog @a[tag=frozen,tag=!rain,tag=!thunder,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000,tag=!fur_helmet] push edx:fog_frozen frozen

fog @a[tag=desert,tag=rain,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_desert_rain drain
fog @a[tag=mesa,tag=rain,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_mesa_rain mrain
fog @a[tag=frozen,tag=rain,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000,tag=!fur_helmet] push edx:fog_frozen_rain frain

fog @a[tag=desert,tag=thunder,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_desert_thunder dthunder
fog @a[tag=mesa,tag=thunder,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_mesa_thunder mthunder
fog @a[tag=frozen,tag=thunder,y=0,dy=150,x=-1000000,dx=2000000,z=-1000000,dz=2000000,tag=!fur_helmet] push edx:fog_frozen_thunder fthunder


fog @a[tag=!desert] remove  desert
fog @a[tag=!mesa] remove  mesa
fog @a[tag=!frozen] remove  frozen
fog @a[tag=fur_helmet] remove  frozen

fog @a[tag=!desert] remove  drain
fog @a[tag=!mesa] remove  mrain
fog @a[tag=!frozen] remove  frain
fog @a[tag=fur_helmet] remove  frain

fog @a[tag=!desert] remove  dthunder
fog @a[tag=!mesa] remove  mthunder
fog @a[tag=!frozen] remove  fthunder
fog @a[tag=fur_helmet] remove  fthunder


fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  desert
fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  mesa
fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  frozen

fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  drain
fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  mrain
fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  frain

fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  dthunder
fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  mthunder
fog @a[y=-1,dy=-120,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  fthunder



fog @a[tag=rain] remove  desert
fog @a[tag=rain] remove  mesa
fog @a[tag=rain] remove  frozen

fog @a[tag=rain] remove  dthunder
fog @a[tag=rain] remove  mthunder
fog @a[tag=rain] remove  fthunder

fog @a[tag=thunder] remove  desert
fog @a[tag=thunder] remove  mesa
fog @a[tag=thunder] remove  frozen

fog @a[tag=thunder] remove  drain
fog @a[tag=thunder] remove  mrain
fog @a[tag=thunder] remove  frain


fog @a[tag=!rain,tag=!thunder] remove  dthunder
fog @a[tag=!rain,tag=!thunder] remove  mthunder
fog @a[tag=!rain,tag=!thunder] remove  fthunder

fog @a[tag=!rain,tag=!thunder] remove  drain  
fog @a[tag=!rain,tag=!thunder] remove  mrain
fog @a[tag=!rain,tag=!thunder] remove  frain


fog @a[tag=nether_wastes,y=65,dy=100,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_sulfur sulfur
fog @a[tag=nether_wastes,y=0,dy=64,x=-1000000,dx=2000000,z=-1000000,dz=2000000] push edx:fog_magma magma


fog @a[tag=!nether_wastes] remove sulfur
fog @a[tag=!nether_wastes] remove magma
fog @a[y=0,dy=64,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove sulfur
fog @a[y=65,dy=100,x=-1000000,dx=2000000,z=-1000000,dz=2000000] remove  magma

#old
fog @a remove  tfrozen
fog @a remove  tdesert
fog @a remove  tmesa
fog @a remove  dmesa