/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    UPDATE games SET 
      name = 'Ordenamiento de Números',
      description = '¡Aprende a ordenar números de forma divertida! Juega y mejora tus habilidades matemáticas de menor a mayor.',
      image_url = '/assets/JuegoOrdenamiento-fontpage.png',
      route = '/alumno/juegos/ordenamiento',
      difficulty_level = 1
    WHERE id = 'game-ordenamiento'
  `);

  pgm.sql(`
    UPDATE games SET 
      name = 'Escribir Números en Palabras',
      description = '¡Aprende a escribir los números en palabras! Arrastra las palabras para formar la respuesta correcta.',
      image_url = '/assets/JuegoEscritura-fontpage.png',
      route = '/alumno/juegos/escritura',
      difficulty_level = 1
    WHERE id = 'game-escritura'
  `);

  pgm.sql(`
    UPDATE games SET 
      name = 'Descomposición y Composición',
      description = '¡Aprende a descomponer y componer números! Descubre el misterio de los valores posicionales.',
      image_url = '/assets/JuegoCompoyDesco-fontpage.png',
      route = '/alumno/juegos/descomposicion',
      difficulty_level = 2
    WHERE id = 'game-descomposicion'
  `);

  pgm.sql(`
    INSERT INTO games (id, name, description, image_url, route, difficulty_level, is_active) 
    VALUES (
      'game-escala',
      'Escala Numérica',
      '¡Explora los números anteriores y posteriores! Completa secuencias y descubre patrones numéricos.',
      '/assets/NumeroPalabras-fontpage.png',
      '/alumno/juegos/escala',
      2,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      image_url = EXCLUDED.image_url,
      route = EXCLUDED.route,
      difficulty_level = EXCLUDED.difficulty_level,
      is_active = EXCLUDED.is_active
  `);

  pgm.sql(`
    UPDATE courses_games SET order_index = 1 WHERE game_id = 'game-ordenamiento'
  `);

  pgm.sql(`
    UPDATE courses_games SET order_index = 2 WHERE game_id = 'game-escritura'
  `);

  pgm.sql(`
    UPDATE courses_games SET order_index = 3 WHERE game_id = 'game-descomposicion'
  `);

  pgm.sql(`
    UPDATE courses_games SET order_index = 4 WHERE game_id = 'game-escala'
  `);

  pgm.sql(`
    INSERT INTO courses_games (id, course_id, game_id, is_enabled, order_index)
    SELECT 
      'course-game-escala-' || c.id,
      c.id,
      'game-escala',
      true,
      4
    FROM courses c
    WHERE NOT EXISTS (
      SELECT 1 FROM courses_games cg 
      WHERE cg.course_id = c.id AND cg.game_id = 'game-escala'
    )
  `);
};

exports.down = (pgm) => {
  // Revertir los cambios: eliminar el juego de escala y restaurar datos originales
  pgm.sql("DELETE FROM courses_games WHERE game_id = 'game-escala'");
  pgm.sql("DELETE FROM games WHERE id = 'game-escala'");

  pgm.sql(`
    UPDATE games SET 
      name = 'Juego de Escritura',
      description = 'Aprende a escribir números correctamente',
      image_url = '/assets/juego1.png',
      route = '/juego-escritura',
      difficulty_level = 1
    WHERE id = 'game-escritura'
  `);

  pgm.sql(`
    UPDATE games SET 
      name = 'Juego de Ordenamiento',
      description = 'Ordena números de menor a mayor',
      image_url = '/assets/juego2.png',
      route = '/juego-ordenamiento',
      difficulty_level = 1
    WHERE id = 'game-ordenamiento'
  `);

  pgm.sql(`
    UPDATE games SET 
      name = 'Juego de Descomposición',
      description = 'Descompone números en unidades, decenas y centenas',
      image_url = '/assets/juego1.png',
      route = '/juego-descomposicion',
      difficulty_level = 2
    WHERE id = 'game-descomposicion'
  `);

  pgm.sql("UPDATE courses_games SET order_index = 0");
};
