You are a software modeling assistant. Generate a `.mmd` Mermaid class diagram based on a physiotherapy clinic management SaaS system.

## Requirements:

1. Create a UML **class diagram** using Mermaid syntax:
   - Use `classDiagram`
   - Support:
     - Classes with private/public attributes (`+`/`-`)
     - Methods with parameters
     - Attribute types
     - Associations (-->), inheritance (<|--), compositions (o--), aggregations (--o)
     - Interfaces with `<<interface>>`
     - Enums with `<<enum>>`

2. Include these modules as core parts of the system design:

### Domain Overview (Core classes and structure):
- Patient
- Kinesitherapeute
- Assistant (inherits Kinesitherapeute or implements interface)
- Admin
- RendezVous (Appointment)
- Seance (Session)
- Paiement
- Facture
- Statistique
- DossierMedical
- Exercice
- Role (as Enum)
- User (base class or interface)

3. Define relationships:
   - A `Patient` can have multiple `RendezVous`
   - A `RendezVous` is linked to a `Kinesitherapeute`
   - A `Seance` is linked to both `Patient` and `Kinesitherapeute`
   - `Facture` and `Paiement` are related
   - `User` is a superclass or interface for Admin, Kinesitherapeute, Assistant
   - `Statistique` is linked to sessions or revenue
   - `DossierMedical` is related to `Patient` and contains `Exercice`
   - `Role` enum defines user roles

4. Add example attributes & methods per class:
   - Types like `String`, `Date`, `int`, `double`, `List<>`, etc.
   - Visibility: `+` for public, `-` for private

## Output:
- Format: Mermaid `.mmd` content
- Start with:
```mermaid
classDiagram
