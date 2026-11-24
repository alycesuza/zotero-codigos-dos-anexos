# zotero-attachment-codes

Exibe automaticamente os códigos das pastas dos anexos em uma coluna independente.

[![Test and package](https://github.com/alycesuza/zotero-attachment-codes/actions/workflows/ci.yml/badge.svg)](https://github.com/alycesuza/zotero-attachment-codes/actions/workflows/ci.yml)
[Releases](https://github.com/alycesuza/zotero-attachment-codes/releases) | [English](docs/README.en.md) | [Changelog](CHANGELOG.md)

## Status e compatibilidade

Versão inicial **0.1.0**, distribuída como **pré-lançamento** para validação no uso diário. Plugin independente para **Zotero 10.0.x**, usando APIs do Zotero Desktop. Não depende das outras extensões desta coleção. Não há suporte declarado para Zotero 6, 7, 8 ou 9 nesta versão.

## Instalação

1. Abra [Releases](https://github.com/alycesuza/zotero-attachment-codes/releases) e escolha a versão desejada, incluindo pré-lançamentos.
2. Baixe o arquivo `zotero-attachment-codes-0.1.0.xpi`. Os arquivos “Source code” não são instaladores.
3. No Zotero, abra **Ferramentas > Extensões**, clique na engrenagem e escolha **Instalar extensão de arquivo**. Dependendo da tradução, o menu pode aparecer como Plugins ou Complementos.
4. Selecione o `.xpi` e confirme a instalação.

## Como usar

A coluna aparece automaticamente. Para mostrar ou ocultar, clique com o botão direito no cabeçalho e marque **Código do anexo**. Referências com vários anexos mostram os códigos separados por vírgulas. Passe o mouse sobre a célula para ler a lista inteira.

## Limites desta versão

Somente leitura. Arquivos vinculados fora do storage não têm código de pasta Zotero. O código não comprova que o arquivo já foi baixado neste computador.

## Dados e privacidade

O processamento é local. O código não envia títulos, PDFs, OCR ou metadados a APIs de IA ou de editoras. A verificação de atualizações usa apenas o GitHub. Relatórios CSV só são gravados quando você escolhe exportar. Não inclua bibliotecas reais, PDFs, credenciais ou relatórios pessoais em Issues.

A extensão não escreve nos campos bibliográficos dos itens.

## Desenvolvimento

Requer Node.js 22 ou superior e Python 3.10 ou superior apenas para desenvolver e empacotar. A instalação do `.xpi` não exige Node ou Python.

```sh
npm test
python scripts/build.py
```

O `.xpi`, seu SHA-256 e `updates.json` são gerados em `build/`. Não há dependências npm de produção. A estrutura contém `src/`, `scripts/`, `tests/`, documentação, CI e publicação de Releases por tag.

## Publicar uma versão

Atualize `package.json`, `src/manifest.json`, `CHANGELOG.md` e `RELEASE_NOTES.md`, execute os testes e o build, faça o commit e crie a tag `vX.Y.Z`. O workflow de Release confere a versão, testa, empacota e publica o `.xpi`, o checksum e `updates.json` como pré-lançamento. Também é possível usar `sh release.sh` após o commit.

O endereço automático de atualização aponta a `releases/latest/download/updates.json`. O GitHub não considera pré-lançamentos como latest: a primeira versão deve ser instalada manualmente. Quando uma versão estiver validada, o mantenedor poderá promovê-la a release estável. Não se altera essa classificação automaticamente após os testes de CI.

## Desinstalar

Desative ou remova a extensão em **Ferramentas > Extensões**. Os documentos da biblioteca permanecem no Zotero. Relatórios já exportados são preservados.

## Licença e inspiração

AGPL-3.0-only. Copyright 2026 Alyce Suza. [Zotero-OCR](https://github.com/dstark/Zotero-OCR) serviu de referência para a organização de plugin, build e Releases. Esta extensão implementa uma função distinta e não incorpora seu mecanismo de OCR. APIs conforme a [documentação do Zotero](https://www.zotero.org/support/dev/zotero_7_for_developers).
