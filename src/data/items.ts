export interface Synergy {
  targetTag: string;
  range: number;
  effect: string;
}

export interface CosmicItem {
  id: string;
  name: string;
  shape: [number, number][]; // Axial [q, r]
  tags: string[];
  synergy?: Synergy;
}

export const COSMIC_ITEMS: CosmicItem[] = [
  // Star 계열
  { id: "nova_01", name: "신성 파편", shape: [[0,0]], tags: ["Star"], synergy: { targetTag: "Star", range: 1, effect: "ATK+10" } },
  { id: "pulsar_01", name: "펄서 심장", shape: [[0,0], [1,0], [0,1], [1,-1]], tags: ["Star", "Electric"], synergy: { targetTag: "Electric", range: 2, effect: "ASPD+20%" } },
  { id: "dwarf_01", name: "백색 왜성", shape: [[0,0]], tags: ["Star", "Density"], synergy: { targetTag: "Gravity", range: 1, effect: "DEF+15" } },
  { id: "binary_01", name: "쌍성계", shape: [[0,0], [1,0]], tags: ["Star"], synergy: { targetTag: "Star", range: 1, effect: "Double_Shot" } },
  { id: "giant_red_01", name: "적색 거성", shape: [[0,0], [1,0], [-1,1], [0,1]], tags: ["Star", "Fire"], synergy: { targetTag: "Fire", range: 1, effect: "Burn_AoE" } },
  { id: "neutron_star_01", name: "중성자별", shape: [[0,0]], tags: ["Star", "Density"], synergy: { targetTag: "Electric", range: 3, effect: "Stun_Chance" } },
  { id: "blue_straggler_01", name: "푸른 방랑자", shape: [[0,0], [0,1], [0,2]], tags: ["Star", "Void"], synergy: { targetTag: "Void", range: 2, effect: "Life_Steal" } },
  { id: "protostar_01", name: "원시별", shape: [[0,0]], tags: ["Star", "Birth"], synergy: { targetTag: "Any", range: 1, effect: "Growth_Stat" } },
  // Nebula/Gas 계열
  { id: "nebula_01", name: "청색 성운", shape: [[0,0], [1,0], [-1,1]], tags: ["Gas", "Nebula"], synergy: { targetTag: "Star", range: 1, effect: "Range+1" } },
  { id: "void_01", name: "공허의 안개", shape: [[0,0], [0,1], [0,-1]], tags: ["Gas", "Void"], synergy: { targetTag: "Void", range: 2, effect: "Dodge+10%" } },
  { id: "crimson_01", name: "진홍빛 가스", shape: [[0,0], [1,-1]], tags: ["Gas", "Fire"], synergy: { targetTag: "Fire", range: 1, effect: "Burn_DOT" } },
  { id: "toxic_cloud_01", name: "독성 가스", shape: [[0,0], [1,0], [1,-1], [0,-1]], tags: ["Gas", "Poison"], synergy: { targetTag: "Poison", range: 1, effect: "Armor_Reduc" } },
  { id: "plasma_field_01", name: "플라즈마 장", shape: [[0,0], [-1,0], [1,0]], tags: ["Gas", "Electric"], synergy: { targetTag: "Electric", range: 1, effect: "Chain_Lightning" } },
  { id: "ether_01", name: "에테르 기류", shape: [[0,0], [1,1]], tags: ["Gas", "Magic"] },
  { id: "solar_wind_01", name: "태양풍", shape: [[0,0], [1,0], [2,0]], tags: ["Gas", "Wind"] },
  // Gravity 계열
  { id: "gravity_01", name: "중력 핵", shape: [[0,0]], tags: ["Gravity"], synergy: { targetTag: "Star", range: 2, effect: "Pull_Enemy" } },
  { id: "event_01", name: "사건의 지평선", shape: [[0,0], [1,0], [-1,0], [0,1], [0,-1], [1,-1], [-1,1]], tags: ["Gravity", "Void"] },
  { id: "singularity_01", name: "특이점", shape: [[0,0]], tags: ["Gravity", "End"] },
  { id: "orbit_ring_01", name: "궤도 고리", shape: [[1,0], [0,1], [-1,1], [-1,0], [0,-1], [1,-1]], tags: ["Gravity", "Tech"] },
  { id: "dark_hole_01", name: "어둠의 구멍", shape: [[0,0], [1,0]], tags: ["Gravity", "Void"] },
  { id: "mass_driver_01", name: "질량 가속기", shape: [[0,0], [1,0], [2,0]], tags: ["Gravity", "Tech"] },
  // Comet/Meteor 계열
  { id: "comet_01", name: "혜성 꼬리", shape: [[0,0], [1,0], [2,0]], tags: ["Comet", "Ice"] },
  { id: "meteor_01", name: "유성우 파편", shape: [[0,0], [1,-1]], tags: ["Comet", "Fire"] },
  { id: "halley_01", name: "헬리 파편", shape: [[0,0], [-1,0], [-2,0]], tags: ["Comet", "Rare"] },
  { id: "ice_shard_01", name: "얼음 파편", shape: [[0,0]], tags: ["Comet", "Ice"] },
  { id: "fire_rain_01", name: "화염비", shape: [[0,0], [0,1], [1,0]], tags: ["Comet", "Fire"] },
  { id: "warp_comet_01", name: "워프 혜성", shape: [[0,0], [2,0]], tags: ["Comet", "Time"] },
  { id: "obsidian_meteor_01", name: "흑요석 유성", shape: [[0,0]], tags: ["Comet", "Density"] },
  // Relic/Ancient 계열
  { id: "chronos_01", name: "크로노스의 톱니", shape: [[0,0], [1,0], [0,1]], tags: ["Relic", "Time"] },
  { id: "solar_01", name: "태양 원반", shape: [[0,0], [1,0], [1,-1], [0,-1], [-1,0], [-1,1], [0,1]], tags: ["Relic", "Sun"] },
  { id: "lunar_01", name: "초승달 팬던트", shape: [[0,0], [-1,1]], tags: ["Relic", "Moon"] },
  { id: "oracle_eye_01", name: "오라클의 눈", shape: [[0,0]], tags: ["Relic", "Magic"] },
  { id: "atlas_pillar_01", name: "아틀라스 기둥", shape: [[0,0], [0,1], [0,2], [0,3]], tags: ["Relic", "Density"] },
  { id: "entropy_box_01", name: "엔트로피 상자", shape: [[0,0], [1,1], [-1,-1]], tags: ["Relic", "Chaos"] },
  { id: "stardust_gem_01", name: "별가루 보석", shape: [[0,0]], tags: ["Relic", "Material"] }
];

export const FUSION_RECIPES = [
  { inputs: ["nova_01", "gravity_01"], result: "black_hole", name: "블랙홀", desc: "적 소멸 및 골드 보너스" },
  { inputs: ["nova_01", "dwarf_01"], result: "supernova", name: "초신성", desc: "화면 전체 폭발 데미지" },
  { inputs: ["nebula_01", "void_01"], result: "abyss_cloud", name: "심연의 구름", desc: "적 스턴 및 명중률 감소" },
  { inputs: ["chronos_01", "gravity_01"], result: "wormhole", name: "웜홀", desc: "투사체 전송 공격" },
  { inputs: ["solar_01", "lunar_01"], result: "eclipse_seal", name: "일식의 인장", desc: "모든 시너지 2단계 활성화" },
  { inputs: ["comet_01", "crimson_01"], result: "burning_comet", name: "불타는 혜성", desc: "영구 화염 장판 생성" },
  { inputs: ["dark_matter", "singularity_01"], result: "big_bang", name: "빅뱅", desc: "모든 아이템 등급 상승" },
  { inputs: ["stardust_gem_01", "protostar_01"], result: "milky_way_garden", name: "은하수 정원", desc: "주기적 아이템 지급" },
  { inputs: ["binary_01", "chronos_01"], result: "time_duet", name: "시간의 이중주", desc: "ASPD 및 쿨타임 가속" },
  { inputs: ["meteor_01", "dark_matter"], result: "abyss_meteor", name: "심연의 메테오", desc: "적 배낭 칸 잠금" },
  { inputs: ["solar_wind_01", "plasma_field_01"], result: "aurora_storm", name: "오로라 폭풍", desc: "Star 위력 100% 증폭" },
  { inputs: ["ice_shard_01", "void_01"], result: "absolute_zero", name: "절대 영도", desc: "적 전체 빙결 및 방어력 무력화" },
  { inputs: ["orbit_ring_01", "mass_driver_01"], result: "stellar_defense", name: "성계 방어망", desc: "배낭 외곽 무적 실드" },
  { inputs: ["oracle_eye_01", "entropy_box_01"], result: "fate_eye", name: "운명의 눈", desc: "무료 리롤권 지급" },
  { inputs: ["atlas_pillar_01", "dwarf_01"], result: "gravity_colossus", name: "중력 거신", desc: "플레이어 최대 HP 2배 증가" },
];
