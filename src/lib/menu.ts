export interface MenuItem {
  name: string;
  desc: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export const MENU: MenuCategory[] = [
  {
    id: "starters",
    title: "المقبلات",
    items: [
      { name: "بروشيتا الطماطم", desc: "خبز محمص، طماطم طازجة، ريحان، زيت زيتون بكر", price: 32 },
      { name: "كاربتشيو لحم بقري", desc: "شرائح لحم رفيعة، جبن بارميزان، روكا، ليمون", price: 58 },
      { name: "بورَتا بالطماطم المجففة", desc: "جبن بورَتا طازج، طماطم مجففة بالشمس، بيستو", price: 46 },
    ],
  },
  {
    id: "pizza",
    title: "البيتزا",
    items: [
      { name: "مارغريتا", desc: "صلصة طماطم، موزاريلا طازجة، ريحان", price: 48 },
      { name: "تارتوفو", desc: "كريمة كمأة، فطر، موزاريلا، زيت الكمأة", price: 68 },
      { name: "بروشوتو وفطر", desc: "بروشوتو إيطالي، فطر بورتشيني، جبن بارميزان", price: 64 },
    ],
  },
  {
    id: "pasta",
    title: "الباستا",
    items: [
      { name: "تارتوفو تالياتيلي", desc: "تالياتيلي طازج، صلصة كريمة الكمأة", price: 72 },
      { name: "لازانيا بولونيز", desc: "طبقات باستا، صلصة لحم بطيئة الطهي، بشاميل", price: 58 },
      { name: "ريزوتو الفطر", desc: "أرز أربوريو، فطر مشكل، بارميزان", price: 62 },
    ],
  },
  {
    id: "desserts",
    title: "الحلا",
    items: [
      { name: "تيراميسو", desc: "طبقات بسكويت، ماسكاربوني، إسبريسو", price: 34 },
      { name: "بانا كوتا", desc: "كريمة مطبوخة، صلصة توت أحمر", price: 30 },
      { name: "كانولي صقلي", desc: "عجينة مقرمشة، حشوة ريكوتا وشوكولاتة", price: 32 },
    ],
  },
];
