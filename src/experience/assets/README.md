# Assets

Este diretório contém **todos os arquivos de conteúdo utilizados pelo jogo**, como artes, sons, fontes, animações e shaders.
Os assets são recursos consumidos pelo Godot e **não contêm lógica de gameplay** — essa permanece em `src/` e `scenes/`.

A organização a seguir facilita manutenção, escalabilidade e colaboração em equipe.

---

## Estrutura Geral

```
assets/
│
├── art/            # Imagens, sprites, tilesets e elementos gráficos
├── audio/          # Trilha sonora, efeitos sonoros e vozes
├── animations/     # Animações, AnimationTrees, sprite sheets
├── fonts/          # Fontes usadas na interface e tipografia
├── shaders/        # Shaders e materiais do Godot
└── raw/            # Arquivos de origem NÃO usados diretamente no jogo
```

---

## **art/**

Contém todos os assets visuais utilizados em jogo.

Exemplos:

* Sprites (`.png`)
* Backgrounds
* Tilesets
* UI elements

Subpastas recomendadas:

```
art/
├── characters/
├── environment/
├── ui/
└── props/
```

> **Importante:** arquivos editáveis (PSD, BLEND, TIFF, etc.) devem ir para `assets/raw/`.

---

## **audio/**

Recursos de áudio utilizados no jogo.

Subdivisões recomendadas:

```
audio/
├── music/     # Músicas
├── sfx/       # Efeitos sonoros
└── voice/     # Dublagem/narração, se houver
```

Formatos recomendados:

* `.ogg` (leve e ideal para jogos)
* `.wav` (curtos, para SFX)

---

## **animations/**

Animações e recursos relacionados:

* `AnimationPlayer` exports
* AnimationTrees
* Spritesheets de animação
* Arquivos `.anim` e `.tres`

---

## **fonts/**

Fontes utilizadas pela UI e textos do jogo.

Recomendação:

* Converter para `.ttf` ou `.otf`
* Se usar DynamicFont no Godot, manter configs aqui também

---

## **shaders/**

Shaders e materiais utilizados pelo jogo.

Estrutura sugerida:

```
shaders/
├── glsl/            # Shaders puros
├── materials/       # Arquivos .tres de materiais
├── post_processing/ # Efeitos de pós-processamento
└── particles/       # Shaders de partículas
```

Os shaders são tratados como *resources* no Godot — por isso ficam dentro de `assets/`.

---

## **raw/**

Esta pasta contém **arquivos brutos**, como:

* `.psd`
* `.blend`
* `.kra`
* `.ai`
* referências visuais
* versões editáveis de arte

Esses arquivos **não são carregados pelo Godot** diretamente e normalmente ficam no `.gitignore` para evitar aumentar o tamanho do repositório.

---

## Boas Práticas

* **Padronize nomes**: `snake_case` ou `kebab-case`.
* **Evite espaços** para prevenir erros no Godot.
* **Evite duplicações**: um asset = uma fonte de verdade.
* **Use subpastas** sempre que um grupo crescer demais.
* **Não coloque código aqui** (vai para `src/`).
* **Mantenha raw separado** para não poluir o projeto final.