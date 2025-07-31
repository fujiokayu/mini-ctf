import { GraphQLError, defaultFieldResolver } from "graphql";
import { mapSchema, MapperKind } from "@graphql-tools/utils";

export function authDirective(roleRequired = "ADMIN") {
  return {
    authDirectiveTransformer(schema: any) {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
          const { resolve = defaultFieldResolver } = fieldConfig;
          const requiresAuth = fieldConfig.astNode?.directives?.some(
            (d: any) => d.name.value === "auth"
          );

          if (!requiresAuth) return fieldConfig;

          fieldConfig.resolve = async function (source: any, args: any, context: any, info: any) {
            // For CTF: Allow IDOR vulnerability - only block direct queries to adminNote
            // But allow access through createFeedback mutation (IDOR vulnerability)
            const isDirectQuery = info.path.prev === undefined || info.path.prev.key === 'user';
            
            if (isDirectQuery && context.user.role !== roleRequired) {
              throw new GraphQLError("Forbidden");
            }
            
            // Allow access through createFeedback mutation (IDOR vulnerability)
            return resolve(source, args, context, info);
          };

          return fieldConfig;
        }
      });
    }
  };
}