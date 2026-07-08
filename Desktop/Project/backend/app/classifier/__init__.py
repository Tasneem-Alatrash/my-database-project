from app.classifier.claude_classifier import ClaudeWasteClassifier

# Single instance used by the API layer. Swap this line to plug in a
# different implementation (e.g. a local YOLO-based classifier) as long
# as it implements the same `classify(image_bytes, media_type)` interface
# defined in `base.py`.
classifier = ClaudeWasteClassifier()
