import type { MaterialName } from './store/reducers/cubeMaterialsSlice'

export type MaterialData = {
    label: string
    preview: string
    albedo: string
    normal: string
    metallic: string
    roughness: string
    ao?: string
    height?: string
}

export const MATERIALS_DATA: {[key in MaterialName]: MaterialData} = {
    asphalt: {
        label: 'Cracking Painted Asphalt',
        preview: 'cracking-painted-asphalt/cracking-painted-asphalt_preview.jpg',
        albedo: 'cracking-painted-asphalt/cracking-painted-asphalt_albedo.png',
        ao: 'cracking-painted-asphalt/cracking-painted-asphalt_ao.png',
        height: 'cracking-painted-asphalt/cracking-painted-asphalt_height.png',
        normal: 'cracking-painted-asphalt/cracking-painted-asphalt_normal.png',
        metallic: 'cracking-painted-asphalt/cracking-painted-asphalt_metallic.png',
        roughness: 'cracking-painted-asphalt/cracking-painted-asphalt_roughness.png'
    },
    hexArmor: {
        label: 'Futuristic Hex Armor',
        preview: 'futuristic-hex-armor/futuristic-hex-armor_preview.jpg',
        albedo: 'futuristic-hex-armor/futuristic-hex-armor_albedo.png',
        ao: 'futuristic-hex-armor/futuristic-hex-armor_ao.png',
        height: 'futuristic-hex-armor/futuristic-hex-armor_height.png',
        normal: 'futuristic-hex-armor/futuristic-hex-armor_normal.png',
        metallic: 'futuristic-hex-armor/futuristic-hex-armor_metallic.png',
        roughness: 'futuristic-hex-armor/futuristic-hex-armor_roughness.png'
    },
    geyserRock: {
        label: 'Geyser Rock',
        preview: 'geyser-rock/geyser-rock_preview.jpg',
        albedo: 'geyser-rock/geyser-rock_albedo.png',
        ao: 'geyser-rock/geyser-rock_ao.png',
        height: 'geyser-rock/geyser-rock_height.png',
        normal: 'geyser-rock/geyser-rock_normal.png',
        metallic: 'geyser-rock/geyser-rock_metallic.png',
        roughness: 'geyser-rock/geyser-rock_roughness.png'
    },
    lightSofa: {
        label: 'Light Sofa',
        preview: 'light-sofa/light-sofa_preview.jpg',
        albedo: 'light-sofa/light-sofa_albedo.png',
        ao: 'light-sofa/light-sofa_ao.png',
        height: 'light-sofa/light-sofa_height.png',
        normal: 'light-sofa/light-sofa_normal.png',
        metallic: 'light-sofa/light-sofa_metallic.png',
        roughness: 'light-sofa/light-sofa_roughness.png'
    },
    titaniumScuffed: {
        label: 'Titanium Scuffed',
        preview: 'titanium-scuffed/titanium-scuffed_preview.jpg',
        albedo: 'titanium-scuffed/titanium-scuffed_albedo.png',
        normal: 'titanium-scuffed/titanium-scuffed_normal.png',
        metallic: 'titanium-scuffed/titanium-scuffed_metallic.png',
        roughness: 'titanium-scuffed/titanium-scuffed_roughness.png'
    },
    wornFactorySiding: {
        label: 'Worn Factory Siding',
        preview: 'worn-factory-siding/worn-factory-siding_preview.jpg',
        albedo: 'worn-factory-siding/worn-factory-siding_albedo.png',
        ao: 'worn-factory-siding/worn-factory-siding_ao.png',
        height: 'worn-factory-siding/worn-factory-siding_height.png',
        normal: 'worn-factory-siding/worn-factory-siding_normal.png',
        metallic: 'worn-factory-siding/worn-factory-siding_metallic.png',
        roughness: 'worn-factory-siding/worn-factory-siding_roughness.png'
    }
}