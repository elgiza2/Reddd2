export interface Reward {
  name: string
  image: string
  value: number
}

export interface Box {
  id: string
  name: string
  price: number
  image: string
  glowColor: string
  type: "free" | "paid"
  rewards: Reward[]
  requiredDeposit?: number
}

export const boxes: Box[] = [
  // Regular paid boxes
  {
    id: "1",
    name: "Sigma Boy",
    price: 0.5,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-12-51-692.png-j9G8lIR54nzj7hUE0SmmN1AOZl4IBy.jpeg",
    glowColor: "from-yellow-400 to-orange-500",
    type: "paid",
    rewards: [
      {
        name: "Perfume Bottle",
        image: "https://assets.pepecase.app/assets/perfume_bottle_glow_verde.png",
        value: 277.78,
      },
      {
        name: "Nail Bracelet",
        image: "https://assets.pepecase.app/assets/nail_bracelet_ultramarine.png",
        value: 222.22,
      },
      { name: "Swiss Watch", image: "https://assets.pepecase.app/assets/swiss_watch_top_gun.png", value: 66.67 },
      { name: "Sleigh Bell", image: "https://assets.pepecase.app/assets/sleigh_bell_sparkles.png", value: 13.32 },
      { name: "Easter Egg", image: "https://assets.pepecase.app/assets/easter_egg_early_bird.png", value: 11.11 },
      { name: "Bow Tie", image: "https://assets.pepecase.app/assets/bow_tie_volleyball.png", value: 7.56 },
      { name: "Snow Mittens", image: "https://assets.pepecase.app/assets/snow_mittens_dark_grape.png", value: 6.67 },
      { name: "Spiced Wine", image: "https://assets.pepecase.app/assets/spiced_wine_capri_sun.png", value: 4.44 },
      { name: "Witch Hat", image: "https://assets.pepecase.app/assets/witch_hat_maleficar.png", value: 4.27 },
      { name: "Winter Wreath", image: "https://assets.pepecase.app/assets/winter_wreath_lemon_cake.png", value: 3.11 },
      { name: "Lunar Snake", image: "https://assets.pepecase.app/assets/lunar_snake_neurotoxin.png", value: 2.67 },
      { name: "Lol Pop", image: "https://assets.pepecase.app/assets/snake_box_buttercup.png", value: 2.22 },
      { name: "Desk Calendar", image: "https://assets.pepecase.app/assets/desk_calendar_rare_event.png", value: 2.22 },
      { name: "Buttercup", image: "https://assets.pepecase.app/assets/snake_box_buttercup.png", value: 2.22 },
      // TON rewards for real play
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton1.png", value: 0.5 },
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton1.png", value: 0.3 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "2",
    name: "Dubai",
    price: 2,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-25-18-944-P6gruR5EIWKMNB5tfWTArILTan0AsN.png",
    glowColor: "from-pink-400 to-purple-500",
    type: "paid",
    rewards: [
      { name: "Durov's Cap", image: "https://assets.pepecase.app/assets/durov's_cap_pinkie_cap.png", value: 888 },
      { name: "Magic Potion", image: "https://assets.pepecase.app/assets/magic_potion_queen_bee.png", value: 195 },
      { name: "Scared Cat", image: "https://assets.pepecase.app/assets/scared_cat_nyan_cat.png", value: 85 },
      { name: "Love Candle", image: "https://assets.pepecase.app/assets/love_candle_setting_sun.png", value: 14 },
      {
        name: "Bunny Muffin",
        image: "https://assets.pepecase.app/assets/bunny_muffin_grandma's_pie.png",
        value: 11.11,
      },
      { name: "Cookie Heart", image: "https://assets.pepecase.app/assets/cookie_heart_nyam_cat.png", value: 6.21 },
      { name: "Jelly Bunny", image: "https://assets.pepecase.app/assets/jelly_bunny_commando.png", value: 5.67 },
      { name: "Hypno Lollipop", image: "https://assets.pepecase.app/assets/hypno_lollipop_saturn.png", value: 3.87 },
      { name: "Jester Hat", image: "https://assets.pepecase.app/assets/jester_hat_dagonet.png", value: 2.44 },
      { name: "Homemade Cake", image: "https://assets.pepecase.app/assets/homemade_cake_pink_whirl.png", value: 2.44 },
      { name: "Lol Pop", image: "https://assets.pepecase.app/assets/lol_pop_wonka_berry.png", value: 2.44 },
      { name: "Ginger Cookie", image: "https://assets.pepecase.app/assets/ginger_cookie_faint_blush.png", value: 2.25 },
      { name: "Candy Cane", image: "https://assets.pepecase.app/assets/candy_cane_sugar_crush.png", value: 2.22 },
      // TON rewards for real play
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton2.png", value: 0.5 },
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton3.png", value: 0.3 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "3",
    name: "KFC",
    price: 3,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-14-28-508.png-n8XrgJEQkK2y5ZJHcGlJ69pdlCjRJy.jpeg",
    glowColor: "from-blue-400 to-cyan-500",
    type: "paid",
    rewards: [
      { name: "Loot Bag", image: "https://assets.pepecase.app/assets/loot_bag_city_life.png", value: 500 },
      { name: "Heroic Helmet", image: "https://assets.pepecase.app/assets/heroic_helmet_mercurial.png", value: 444 },
      { name: "Eternal Rose", image: "https://assets.pepecase.app/assets/eternal_rose_moonstone.png", value: 19.24 },
      { name: "Record Player", image: "https://assets.pepecase.app/assets/record_player_passion_funk.png", value: 14 },
      {
        name: "Party Sparkler",
        image: "https://assets.pepecase.app/assets/party_sparkler_superpower.png",
        value: 7.78,
      },
      { name: "Sakura Flower", image: "https://assets.pepecase.app/assets/sakura_flower_barbia.png", value: 6.11 },
      { name: "Spy Agaric", image: "https://assets.pepecase.app/assets/spy_agaric_sunspot.png", value: 4.3 },
      { name: "Star Notepad", image: "https://assets.pepecase.app/assets/star_notepad_marakuja.png", value: 4.11 },
      { name: "Candy Cane", image: "https://assets.pepecase.app/assets/candy_cane_diggory.png", value: 2.3 },
      { name: "Snake Box", image: "https://assets.pepecase.app/assets/snake_box_purple.png", value: 2.22 },
      { name: "Lol Pop", image: "https://assets.pepecase.app/assets/lol_pop_cherry_cola.png", value: 2.22 },
      // TON rewards for real play
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton3.png", value: 1 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "4",
    name: "Boss",
    price: 5,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-22-14-751.png-l0kuDgOc1FGVs7FZ1HI3qXntCTWVi9.jpeg",
    glowColor: "from-red-400 to-pink-500",
    type: "paid",
    rewards: [
      { name: "Precious Peach", image: "https://assets.pepecase.app/assets/precious_peach_ruby_red.png", value: 1666 },
      { name: "Ion Gem", image: "https://assets.pepecase.app/assets/ion_gem_blood_gem.png", value: 1111 },
      { name: "Electric Skull", image: "https://assets.pepecase.app/assets/electric_skull_hellfire.png", value: 150 },
      { name: "Signet Ring", image: "https://assets.pepecase.app/assets/signet_ring_onyx_demon.png", value: 110 },
      { name: "Love Potion", image: "https://assets.pepecase.app/assets/love_potion_bloodlust.png", value: 43 },
      { name: "Flying Broom", image: "https://assets.pepecase.app/assets/flying_broom_red_rotation.png", value: 27 },
      { name: "Homemade Cake", image: "https://assets.pepecase.app/assets/homemade_cake_red_velvet.png", value: 10 },
      { name: "Jelly Bunny", image: "https://assets.pepecase.app/assets/jelly_bunny_red_hot.png", value: 6 },
      { name: "Party Sparkler", image: "https://assets.pepecase.app/assets/party_sparkler_red_hot.png", value: 5.5 },
      { name: "Jester Hat", image: "https://assets.pepecase.app/assets/jester_hat_evil_eye.png", value: 5.43 },
      { name: "Evil Eye", image: "https://assets.pepecase.app/assets/evil_eye_do_not_disturb.png", value: 3.11 },
      // TON rewards for real play
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton1.png", value: 0.5 },
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton1.png", value: 0.3 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "5",
    name: "Homeless",
    price: 5,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-17-44-514.png-WQZvGVHYYVoS3ZX0w55NT88kefrmPd.jpeg",
    glowColor: "from-green-400 to-emerald-500",
    type: "paid",
    rewards: [
      { name: "Plush Pepe", image: "https://assets.pepecase.app/assets/plush_pepe_red_pepple.png", value: 6172 },
      { name: "Durov's Cap", image: "https://assets.pepecase.app/assets/durov's_cap_redrum.png", value: 1666 },
      { name: "Lol Pop", image: "https://assets.pepecase.app/assets/lol_pop_blood_ember.png", value: 2.5 },
      // TON rewards for real play
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton1.png", value: 1 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "6",
    name: "Director",
    price: 10,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-26-55-948.png-oWdSLjfc6fiNhthJAls6gmX8riiKiM.jpeg",
    glowColor: "from-purple-400 to-indigo-500",
    type: "paid",
    rewards: [
      {
        name: "Precious Peach",
        image: "https://assets.pepecase.app/assets/precious_peach_jelly_bubble.png",
        value: 1008,
      },
      { name: "Scared Cat", image: "https://assets.pepecase.app/assets/scared_cat_endercat.png", value: 85 },
      { name: "Electric Skull", image: "https://assets.pepecase.app/assets/electric_skull_happy_end.png", value: 60 },
      { name: "Sharp Tongue", image: "https://assets.pepecase.app/assets/sharp_tongue_vampire.png", value: 35 },
      { name: "Voodoo Doll", image: "https://assets.pepecase.app/assets/voodoo_doll_emo_curse.png", value: 21 },
      { name: "Witch Hat", image: "https://assets.pepecase.app/assets/witch_hat_black_magic.png", value: 15 },
      { name: "Skull Flower", image: "https://assets.pepecase.app/assets/skull_flower_black_dahlia.png", value: 13 },
      { name: "Crystal Ball", image: "https://assets.pepecase.app/assets/crystal_ball_silver.png", value: 12 },
      { name: "Flying Broom", image: "https://assets.pepecase.app/assets/flying_broom_colorless.png", value: 11 },
      { name: "Candy Cane", image: "https://assets.pepecase.app/assets/candy_cane_old_school.png", value: 5 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "7",
    name: "Oligarch",
    price: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-07-01_14-57-14-482.png-25EIbvu1HyQhgHJcpbURo43bba0lE0.jpeg",
    glowColor: "from-indigo-400 to-blue-500",
    type: "paid",
    rewards: [
      { name: "Durov's Cap", image: "https://assets.pepecase.app/assets/durov's_cap_frosthorn.png", value: 1500 },
      { name: "Loot Bag", image: "https://assets.pepecase.app/assets/loot_bag_glacier.png", value: 400 },
      { name: "Vintage Cigar", image: "https://assets.pepecase.app/assets/vintage_cigar_saturn_v.png", value: 144 },
      { name: "Astral Shard", image: "https://assets.pepecase.app/assets/astral_shard_sapphire.png", value: 115 },
      { name: "Swiss Watch", image: "https://assets.pepecase.app/assets/swiss_watch_delorean.png", value: 50 },
      { name: "Signet Ring", image: "https://assets.pepecase.app/assets/signet_ring_white_gold.png", value: 33 },
      { name: "Homemade Cake", image: "https://assets.pepecase.app/assets/homemade_cake_frosty.png", value: 15 },
      // TON rewards for real play
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton1.png", value: 20 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "8",
    name: "Premium",
    price: 100,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-30_20-00-57-302.png-t43ivY3QCAGiXNxcm3HMiBNRpJCyxn.jpeg",
    glowColor: "from-gray-400 to-gray-600",
    type: "paid",
    rewards: [
      { name: "Plush Pepe", image: "https://assets.pepecase.app/assets/plush_pepe_gummy_frog.png", value: 5555 },
      { name: "Heroic Helmet", image: "https://assets.pepecase.app/assets/heroic_helmet_pale_guard.png", value: 388 },
      { name: "Mini Oscar", image: "https://assets.pepecase.app/assets/mini_oscar_pirate.png", value: 218 },
      { name: "Astral Shard", image: "https://assets.pepecase.app/assets/astral_shard_rgb-ite.png", value: 200 },
      { name: "Nail Bracelet", image: "https://assets.pepecase.app/assets/nail_bracelet_argent.png", value: 166 },
      { name: "Bonded Ring", image: "https://assets.pepecase.app/assets/bonded_ring_line_art.png", value: 90 },
      { name: "Genie Lamp", image: "https://assets.pepecase.app/assets/genie_lamp_copper_pot.png", value: 71 },
      { name: "Kissed Frog", image: "https://assets.pepecase.app/assets/kissed_frog_lily_pond.png", value: 61 },
      { name: "Bow Tie", image: "https://assets.pepecase.app/assets/bow_tie_sailor_moon.png", value: 9 },
      // TON rewards for real play
      { name: "Ton Balance", image: "https://assets.pepecase.app/assets/ton1.png", value: 10 },
    ].sort((a, b) => b.value - a.value),
  },
  // Free boxes that unlock with deposits
  {
    id: "free-1",
    name: "Deposit Bonus 10",
    price: 0,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-22-14-751.png-l0kuDgOc1FGVs7FZ1HI3qXntCTWVi9.jpeg",
    glowColor: "from-green-400 to-emerald-500",
    type: "free",
    requiredDeposit: 10,
    rewards: [
      { name: "Durov's Cap", image: "https://assets.pepecase.app/assets/durov's_cap_redrum.png", value: 1666 },
      { name: "Precious Peach", image: "https://assets.pepecase.app/assets/precious_peach_ruby_red.png", value: 1666 },
      { name: "Ion Gem", image: "https://assets.pepecase.app/assets/ion_gem_blood_gem.png", value: 1111 },
      { name: "Electric Skull", image: "https://assets.pepecase.app/assets/electric_skull_hellfire.png", value: 150 },
      { name: "Signet Ring", image: "https://assets.pepecase.app/assets/signet_ring_onyx_demon.png", value: 110 },
      { name: "Flying Broom", image: "https://assets.pepecase.app/assets/flying_broom_red_rotation.png", value: 27 },
      { name: "Homemade Cake", image: "https://assets.pepecase.app/assets/homemade_cake_red_velvet.png", value: 10 },
      { name: "Jelly Bunny", image: "https://assets.pepecase.app/assets/jelly_bunny_red_hot.png", value: 6 },
      { name: "Party Sparkler", image: "https://assets.pepecase.app/assets/party_sparkler_red_hot.png", value: 5.5 },
      { name: "Jester Hat", image: "https://assets.pepecase.app/assets/jester_hat_evil_eye.png", value: 5.43 },
      { name: "Evil Eye", image: "https://assets.pepecase.app/assets/evil_eye_do_not_disturb.png", value: 3.11 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "free-2",
    name: "Deposit Bonus 20",
    price: 0,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-29_21-26-55-948.png-oWdSLjfc6fiNhthJAls6gmX8riiKiM.jpeg",
    glowColor: "from-purple-400 to-indigo-500",
    type: "free",
    requiredDeposit: 20,
    rewards: [
      {
        name: "Precious Peach",
        image: "https://assets.pepecase.app/assets/precious_peach_jelly_bubble.png",
        value: 1008,
      },
      { name: "Scared Cat", image: "https://assets.pepecase.app/assets/scared_cat_endercat.png", value: 85 },
      { name: "Electric Skull", image: "https://assets.pepecase.app/assets/electric_skull_happy_end.png", value: 60 },
      { name: "Sharp Tongue", image: "https://assets.pepecase.app/assets/sharp_tongue_vampire.png", value: 35 },
      { name: "Voodoo Doll", image: "https://assets.pepecase.app/assets/voodoo_doll_emo_curse.png", value: 21 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "free-3",
    name: "Deposit Bonus 50",
    price: 0,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-07-01_14-57-14-482.png-25EIbvu1HyQhgHJcpbURo43bba0lE0.jpeg",
    glowColor: "from-indigo-400 to-blue-500",
    type: "free",
    requiredDeposit: 50,
    rewards: [
      { name: "Durov's Cap", image: "https://assets.pepecase.app/assets/durov's_cap_frosthorn.png", value: 1500 },
      { name: "Loot Bag", image: "https://assets.pepecase.app/assets/loot_bag_glacier.png", value: 400 },
      { name: "Vintage Cigar", image: "https://assets.pepecase.app/assets/vintage_cigar_saturn_v.png", value: 144 },
      { name: "Astral Shard", image: "https://assets.pepecase.app/assets/astral_shard_sapphire.png", value: 115 },
      { name: "Swiss Watch", image: "https://assets.pepecase.app/assets/swiss_watch_delorean.png", value: 50 },
      { name: "Signet Ring", image: "https://assets.pepecase.app/assets/signet_ring_white_gold.png", value: 33 },
      { name: "Homemade Cake", image: "https://assets.pepecase.app/assets/homemade_cake_frosty.png", value: 15 },
    ].sort((a, b) => b.value - a.value),
  },
  {
    id: "free-4",
    name: "Deposit Bonus 100",
    price: 0,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-06-30_20-00-57-302.png-t43ivY3QCAGiXNxcm3HMiBNRpJCyxn.jpeg",
    glowColor: "from-gray-400 to-gray-600",
    type: "free",
    requiredDeposit: 100,
    rewards: [
      { name: "Plush Pepe", image: "https://assets.pepecase.app/assets/plush_pepe_gummy_frog.png", value: 5555 },
      { name: "Heroic Helmet", image: "https://assets.pepecase.app/assets/heroic_helmet_pale_guard.png", value: 388 },
      { name: "Mini Oscar", image: "https://assets.pepecase.app/assets/mini_oscar_pirate.png", value: 218 },
      { name: "Astral Shard", image: "https://assets.pepecase.app/assets/astral_shard_rgb-ite.png", value: 200 },
      { name: "Nail Bracelet", image: "https://assets.pepecase.app/assets/nail_bracelet_argent.png", value: 166 },
      { name: "Genie Lamp", image: "https://assets.pepecase.app/assets/genie_lamp_copper_pot.png", value: 71 },
      { name: "Kissed Frog", image: "https://assets.pepecase.app/assets/kissed_frog_lily_pond.png", value: 61 },
    ].sort((a, b) => b.value - a.value),
  },
]
