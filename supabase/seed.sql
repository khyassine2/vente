-- Fil & Ligne — seed data
-- Run this in the Supabase SQL editor AFTER schema.sql.
-- Inserts the 12 original catalogue pieces. Safe to re-run: it deletes any
-- product with the same slug first.

do $$
declare
  v_product_id uuid;
begin

  -- 1. Chemise en lin Tanger ---------------------------------------------
  delete from public.products where slug = 'chemise-lin-tanger';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'chemise-lin-tanger',
    'Chemise en lin Tanger',
    'Un lin lavé qui tombe droit sans jamais coller, tissé pour les mois où l''air ne bouge plus. Le col reste souple, les manches se retroussent et gardent leur pli.',
    array['Coupe droite, emmanchure basse', 'Boutons en corozo teintés à la main', 'Ourlet arrondi, portable dedans ou dehors'],
    '100% lin lavé, 160 g/m²',
    449, true, array['nouveautes', 'chemises']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Écru', '#efe9dd'), ('Forêt', '#1f3d33'), ('Terracotta', '#b5563c')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 2);

  -- 2. Veste d'atelier Rabat -----------------------------------------------
  delete from public.products where slug = 'veste-atelier-rabat';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'veste-atelier-rabat',
    'Veste d''atelier Rabat',
    'La veste de travail française, reprise en coton serré et montée sans doublure. Trois poches plaquées, une épaule franche, et une teinte qui se patine au fil des lavages.',
    array['Coton sergé teint en pièce', 'Trois poches plaquées, une intérieure', 'Coutures rabattues, sans doublure'],
    '100% coton sergé, 320 g/m²',
    890, true, array['nouveautes', 'vestes']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Forêt', '#1f3d33'), ('Sable', '#e3d5c1')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1548126032-079a0fb0099d', 2);

  -- 3. Pull en maille Cèdre -------------------------------------------------
  delete from public.products where slug = 'pull-maille-cedre';
  insert into public.products (slug, name, description, details, fabric, price, compare_at_price, is_new, categories)
  values (
    'pull-maille-cedre',
    'Pull en maille Cèdre',
    'Une maille côtelée en laine mérinos, tricotée en jauge moyenne pour tenir sa forme aux coudes et aux poignets. Elle se porte à même la peau sans gratter.',
    array['Col rond bordé côtelé', 'Tricoté en jauge 7, sans couture d''épaule', 'Lavable à la main, séchage à plat'],
    '100% laine mérinos extra-fine',
    690, 850, false, array['mailles']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Avoine', '#ded6ca'), ('Encre', '#14201b')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7', 2);

  -- 4. Pantalon fluide Oasis -------------------------------------------------
  delete from public.products where slug = 'pantalon-fluide-oasis';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'pantalon-fluide-oasis',
    'Pantalon fluide Oasis',
    'Une jambe large qui tombe d''un seul trait depuis la hanche, taille haute tenue par une ceinture nervurée. Le tissu bouge sans se froisser à chaque pas.',
    array['Taille haute, passants larges', 'Deux poches italiennes, une poche dos', 'Jambe large, ourlet non fini au choix'],
    '68% lyocell, 32% lin',
    590, true, array['nouveautes', 'pantalons']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('36'), ('38'), ('40'), ('42'), ('44')
  ) as s(size)
  cross join (
    values ('Encre', '#14201b'), ('Sable', '#e3d5c1'), ('Sauge', '#5d7367')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80', 2);

  -- 5. Robe longue Sahara -----------------------------------------------------
  delete from public.products where slug = 'robe-longue-sahara';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'robe-longue-sahara',
    'Robe longue Sahara',
    'Une colonne de tissu retenue à la taille par une ceinture nouée. Elle se met le matin et se porte jusqu''au soir sans jamais demander d''ajustement.',
    array['Manches trois-quarts légèrement bouffantes', 'Ceinture amovible en même tissu', 'Doublure courte sur le buste'],
    '55% lin, 45% viscose',
    790, true, array['nouveautes', 'robes']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Terracotta', '#b5563c'), ('Écru', '#efe9dd')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1483118714900-540cf339fd46', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 2);

  -- 6. Chemise popeline Essaouira ----------------------------------------------
  delete from public.products where slug = 'chemise-popeline-essaouira';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'chemise-popeline-essaouira',
    'Chemise popeline Essaouira',
    'La chemise blanche qu''on reprend chaque semaine. Popeline de coton à armure serrée, col italien qui tient ouvert comme fermé.',
    array['Col italien à pointes courtes', 'Poignets une bouton, plis d''aisance', 'Coutures anglaises sur les côtés'],
    '100% coton popeline, 120 g/m²',
    420, false, array['chemises']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Blanc', '#faf7f2'), ('Sauge', '#5d7367')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e', 2);

  -- 7. Gilet en maille Medina -------------------------------------------------
  delete from public.products where slug = 'gilet-maille-medina';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'gilet-maille-medina',
    'Gilet en maille Medina',
    'Un gilet sans manches à porter sur une chemise quand la nuit tombe. Encolure en V profonde, emmanchures bordées pour ne pas bâiller.',
    array['Encolure V, bord-côtes assortis', 'Cinq boutons en nacre', 'Coupe près du corps'],
    '85% coton, 15% laine',
    540, false, array['mailles']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Sable', '#e3d5c1'), ('Forêt', '#1f3d33')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', 2);

  -- 8. Manteau long Cachemire ---------------------------------------------------
  delete from public.products where slug = 'manteau-long-cachemire';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'manteau-long-cachemire',
    'Manteau long Cachemire',
    'Un manteau droit qui descend sous le genou, taillé dans un drap de laine mêlé de cachemire. Il se ferme par deux boutons et garde son aplomb sur le cintre comme sur l''épaule.',
    array['Deux boutons, revers cranté', 'Doublure cupro sur tout le corps', 'Fente dos centrale'],
    '80% laine, 20% cachemire',
    1890, false, array['vestes']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Avoine', '#ded6ca'), ('Encre', '#14201b')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1551163943-3f6a855d1153', 2);

  -- 9. Pantalon droit Souk ----------------------------------------------------
  delete from public.products where slug = 'pantalon-droit-souk';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'pantalon-droit-souk',
    'Pantalon droit Souk',
    'Une jambe droite qui casse juste sur la chaussure. Le coton est assez dense pour marquer le pli, assez souple pour s''asseoir sans y penser.',
    array['Taille mi-haute, braguette zippée', 'Pli marqué permanent', 'Ourlet 4 cm, retouche possible'],
    '98% coton, 2% élasthanne',
    520, false, array['pantalons']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('36'), ('38'), ('40'), ('42'), ('44')
  ) as s(size)
  cross join (
    values ('Sauge', '#5d7367'), ('Encre', '#14201b'), ('Sable', '#e3d5c1')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec', 2);

  -- 10. Écharpe en laine Atlas -------------------------------------------------
  delete from public.products where slug = 'echarpe-laine-atlas';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'echarpe-laine-atlas',
    'Écharpe en laine Atlas',
    'Deux mètres de laine tissée dans les montagnes, à franges nouées une à une. Assez large pour se porter en châle sur les épaules.',
    array['Tissée sur métier traditionnel', '200 × 45 cm, franges nouées main', 'Chaque pièce varie légèrement'],
    '100% laine des montagnes',
    290, false, array['accessoires']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('Taille unique')
  ) as s(size)
  cross join (
    values ('Terracotta', '#b5563c'), ('Avoine', '#ded6ca'), ('Forêt', '#1f3d33')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1457545195570-67f207084966', 2);

  -- 11. Blouse Ourika -----------------------------------------------------------
  delete from public.products where slug = 'blouse-manches-longues-ourika';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'blouse-manches-longues-ourika',
    'Blouse Ourika',
    'Une blouse ample resserrée aux poignets, avec une fronce discrète sous l''empiècement d''épaule. Elle rentre dans une taille haute sans faire d''épaisseur.',
    array['Empiècement d''épaule fronçé', 'Poignets boutonnés', 'Col montant sans pied'],
    '100% coton voile',
    460, true, array['chemises', 'nouveautes']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('XS'), ('S'), ('M'), ('L'), ('XL')
  ) as s(size)
  cross join (
    values ('Écru', '#efe9dd'), ('Sauge', '#5d7367')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e', 2);

  -- 12. Ceinture en cuir Fès -----------------------------------------------------
  delete from public.products where slug = 'ceinture-cuir-fes';
  insert into public.products (slug, name, description, details, fabric, price, is_new, categories)
  values (
    'ceinture-cuir-fes',
    'Ceinture en cuir Fès',
    'Cuir tanné à l''écorce, coupé dans une seule bande et cousu au fil de lin. La boucle en laiton brossé se ternit doucement.',
    array['Cuir pleine fleur tanné végétal', 'Boucle laiton massif brossé', 'Largeur 3 cm'],
    'Cuir de vachette tanné végétal',
    340, false, array['accessoires']
  ) returning id into v_product_id;

  insert into public.product_variants (product_id, size, color_name, color_hex)
  select v_product_id, size, color_name, color_hex from (
    values ('36'), ('38'), ('40'), ('42'), ('44')
  ) as s(size)
  cross join (
    values ('Cognac', '#8a5a3b'), ('Encre', '#14201b')
  ) as c(color_name, color_hex);

  insert into public.product_images (product_id, url, sort_order) values
    (v_product_id, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc', 0),
    (v_product_id, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 1),
    (v_product_id, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8', 2);

end $$;
