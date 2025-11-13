"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Lightbulb, Target } from "lucide-react";

export function EducationSection() {
  return (
    <div className="space-y-8">
      {/* Guide Tabs */}
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="basics">Getting Started</TabsTrigger>
          <TabsTrigger value="interpretation">
            Result Interpretation
          </TabsTrigger>
          <TabsTrigger value="advanced">Advanced Topics</TabsTrigger>
        </TabsList>

        {/* Getting Started */}
        <TabsContent value="basics" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5" />
                What is Protein Classification?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm px-4 sm:px-6">
              <p>
                Protein classification is the process of categorizing proteins
                based on their structure, function, and evolutionary
                relationships. This tool focuses on functional classification
                using:
              </p>

              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <strong>Amino acid composition</strong> - The types and
                  proportions of amino acids present
                </li>
                <li>
                  <strong>Sequence properties</strong> - Hydrophobicity, charge
                  distribution, and structural patterns
                </li>
                <li>
                  <strong>Pre-trained language models</strong> - ESM-2 and
                  ProtT5 embeddings for deep learning
                </li>
              </ul>

              <div className="bg-accent/5 border border-accent/20 rounded p-3 space-y-2">
                <p className="font-medium text-accent">
                  Why Functional Classification?
                </p>

                <p className="text-muted-foreground">
                  Understanding what a protein does is crucial for drug
                  discovery, metabolic engineering, and disease understanding.
                  Functional annotation accelerates these research areas by
                  predicting protein roles from sequence alone.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                How to Use This Tool
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: "Input Your Protein",
                    description:
                      "Provide either a raw protein sequence or a UniProt ID. Sequences can be in single-letter (MVHLTPE...) or FASTA format.",
                  },
                  {
                    step: 2,
                    title: "Analysis Processing",
                    description:
                      "The tool analyzes your sequence using pre-trained models to extract features and generate embeddings.",
                  },
                  {
                    step: 3,
                    title: "Functional Prediction",
                    description:
                      "Classification engine maps features to Gene Ontology terms, predicting primary and secondary functions.",
                  },
                  {
                    step: 4,
                    title: "Review & Export",
                    description:
                      "Examine detailed results with confidence scores and download data in JSON or CSV format for further analysis.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex-col sm:flex gap-4">
                    <div className="shrink-0">
                      <div className="flex size-6 sm:size-8 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
                        {item.step}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">{item.title}</p>

                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Result Interpretation */}
        <TabsContent value="interpretation" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="size-5" />
                Understanding Your Results
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm px-4 sm:px-6">
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Confidence Scores</p>

                  <p className="text-muted-foreground mb-2">
                    Each prediction includes a confidence score (0-100%)
                    indicating the model's certainty. Scores are based on:
                  </p>

                  <ul className="space-y-1 list-disc list-inside text-muted-foreground text-xs">
                    <li>
                      Sequence composition alignment with known functional
                      patterns
                    </li>
                    <li>
                      Embedding similarity to proteins with known annotations
                    </li>
                    <li>Feature strength and consistency</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">
                    Primary vs Secondary Functions
                  </p>

                  <p className="text-muted-foreground">
                    <strong>Primary functions</strong> have highest confidence
                    scores and are most likely based on sequence features.{" "}
                    <strong>Secondary functions</strong> are contextual or less
                    certain but may be important for specialized cases.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-2">Gene Ontology Terms (GO)</p>

                  <p className="text-muted-foreground mb-2">
                    Predictions are mapped to standardized Gene Ontology terms
                    across three categories:
                  </p>

                  <div className="grid gap-2">
                    {[
                      {
                        label: "Molecular Function (MF)",
                        desc: "What the protein does biochemically",
                        examples: "kinase, binding, catalysis",
                      },
                      {
                        label: "Biological Process (BP)",
                        desc: "Larger cellular/biological goals",
                        examples: "metabolism, cell cycle, signaling",
                      },
                      {
                        label: "Cellular Component (CC)",
                        desc: "Where the protein is located",
                        examples: "nucleus, membrane, mitochondria",
                      },
                    ].map((cat, i) => (
                      <div key={i} className="bg-muted/50 rounded p-3">
                        <div className="font-medium text-xs mb-1">
                          {cat.label}
                        </div>

                        <p className="text-xs text-muted-foreground mb-1">
                          {cat.desc}
                        </p>

                        <p className="text-xs text-accent">
                          Examples: {cat.examples}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Interpreting Sequence Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                {
                  metric: "Hydrophobicity",
                  meaning:
                    "Higher values suggest membrane association or lipid-binding roles",
                  range: "0-100% hydrophobic residues",
                },
                {
                  metric: "Net Charge",
                  meaning:
                    "Highly charged proteins often bind nucleic acids or participate in ion transport",
                  range: "Positive to negative charge balance",
                },
                {
                  metric: "Cysteine Content",
                  meaning:
                    "High cysteine suggests disulfide bonds (structural proteins, redox enzymes)",
                  range: "0-10% typical, varies by function",
                },
                {
                  metric: "Proline Content",
                  meaning:
                    "Proline-rich regions often indicate signal transduction or structural features",
                  range: "1-8% typical",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-b border-border last:border-b-0 pb-3 last:pb-0"
                >
                  <p className="font-medium mb-1">{item.metric}</p>

                  <p className="text-muted-foreground text-xs mb-1">
                    {item.meaning}
                  </p>

                  <Badge variant="outline" className="text-xs">
                    {item.range}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Topics */}
        <TabsContent value="advanced" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Pre-trained Language Models</CardTitle>
              <CardDescription>
                Understanding the AI models powering this tool
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm px-4 sm:px-6">
              <div>
                <p className="font-medium mb-2">
                  ESM-2 (Evolutionary Scale Modeling)
                </p>

                <p className="text-muted-foreground mb-2">
                  Developed by Meta AI and described in Rives et al. (2021),
                  ESM-2 is a large-scale language model trained on billions of
                  protein sequences. It generates contextual embeddings that
                  capture functional and evolutionary information.
                </p>

                <div className="bg-muted/50 rounded p-3 text-xs space-y-1">
                  <p>
                    <strong>Key features:</strong> Captures long-range
                    dependencies, robust to mutations, interpretable
                  </p>

                  <p>
                    <strong>Best for:</strong> Sequence similarity, function
                    prediction, mutation analysis
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">ProtT5 (Protein T5)</p>

                <p className="text-muted-foreground mb-2">
                  ProtT5 adapts the T5 transformer architecture for proteins,
                  trained on UniProt sequences. It provides complementary
                  embeddings useful for structure prediction and functional
                  annotation.
                </p>

                <div className="bg-muted/50 rounded p-3 text-xs space-y-1">
                  <p>
                    <strong>Key features:</strong> Encode-decode architecture,
                    transfer learning friendly
                  </p>

                  <p>
                    <strong>Best for:</strong> Structure-to-function mapping,
                    sequence generation
                  </p>
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>Note:</strong> This tool uses rule-based
                  classification on computed features. For production use,
                  consider fine-tuning these models on task-specific datasets.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Multi-functional Proteins</CardTitle>
              <CardDescription>
                How to interpret proteins with multiple roles
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm px-4 sm:px-6">
              <p className="text-muted-foreground">
                Many proteins have evolved multiple functions, either in
                different cellular contexts or domains. This tool attempts to
                identify these via:
              </p>

              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <strong>Primary functions:</strong> Most confident predictions
                  from dominant sequence features
                </li>

                <li>
                  <strong>Secondary functions:</strong> Context-dependent or
                  domain-specific roles
                </li>

                <li>
                  <strong>Notes field:</strong> Sequence anomalies or
                  characteristics suggesting specialized functions
                </li>
              </ul>

              <div className="bg-muted/50 rounded p-3">
                <p className="font-medium mb-2 text-xs">
                  Example: Immunoglobulin
                </p>

                <p className="text-xs text-muted-foreground">
                  Antibodies combine binding functions (antigen recognition),
                  signaling, and complement activation. This tool would detect
                  the high charge (binding) and glycosylation features
                  characteristic of these roles.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key References */}
      <Card className="border-border">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Key References & Resources</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-2 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Gene Ontology Consortium",
                description:
                  "Official Gene Ontology resource for protein functional annotation",
                link: "http://geneontology.org/",
              },
              {
                title: "UniProt Knowledgebase",
                description:
                  "Comprehensive protein sequence and functional annotation database",
                link: "https://www.uniprot.org/",
              },
              {
                title: "ESM GitHub Repository",
                description:
                  "Implementation and documentation for ESM protein models",
                link: "https://github.com/facebookresearch/esm",
              },
              {
                title: "ProtT5 Documentation",
                description:
                  "Pre-trained protein language models from University of Tübingen",
                link: "https://github.com/ProtTrans/ProtTrans",
              },
              {
                title: "PubMed",
                description:
                  "Search research literature on protein function and classification",
                link: "https://pubmed.ncbi.nlm.nih.gov/",
              },
              {
                title: "InterPro",
                description:
                  "Protein families, domains, and functional sites database",
                link: "https://www.ebi.ac.uk/interpro/",
              },
            ].map((ref, i) => (
              <Card key={i} className="border-border">
                <CardContent className="pt-4 px-4 sm:px-6">
                  <p className="font-medium text-sm mb-1">{ref.title}</p>

                  <p className="text-xs text-muted-foreground mb-3">
                    {ref.description}
                  </p>

                  <a
                    href={ref.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-xs font-medium inline-flex items-center gap-1"
                  >
                    Visit resource
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-border bg-accent/5">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base">
            Best Practices for Students & Researchers
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3">
            {[
              "Always validate computational predictions with literature and experimental evidence",
              "Use multiple tools for cross-validation - no single predictor is 100% accurate",
              "Consider sequence length and quality - predictions are more reliable for longer sequences",
              "Explore domain structure separately using InterPro or SMART databases",
              "Check UniProt annotations for experimentally verified functions",
              "Examine GO evidence codes - IEA (computationally inferred) is less reliable than IDA (direct assay)",
            ].map((tip, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-accent font-bold">•</span>

                <p className="text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
